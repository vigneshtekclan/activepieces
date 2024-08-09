import { logger, system, SystemProp } from '@activepieces/server-shared'
import { ApEnvironment, NotificationStatus, PackageType, PieceScope } from '@activepieces/shared'
import { authenticationService } from '../../authentication/authentication-service'
import { Provider } from '../../authentication/authentication-service/hooks/authentication-service-hooks'
import { FlagEntity } from '../../flags/flag.entity'
import { pieceService } from '../../pieces/piece-service'
import { ProjectEntity } from '../../project/project-entity'
import { databaseConnection } from '../database-connection'

const DEV_DATA_SEEDED_FLAG = 'DEV_DATA_SEEDED'
const PROD_DATA_SEEDED_FLAG = 'PROD_DATA_SEEDED'
const PIECES_DATA_SEEDED_FLAG = 'PIECES_DATA_SEEDED'

const currentEnvIsNotDev = (): boolean => {
    const env = system.get(SystemProp.ENVIRONMENT)
    return env !== ApEnvironment.DEVELOPMENT
}

const devDataAlreadySeeded = async (): Promise<boolean> => {
    const flagRepo = databaseConnection.getRepository(FlagEntity)
    const devSeedsFlag = await flagRepo.findOneBy({ id: DEV_DATA_SEEDED_FLAG })
    return devSeedsFlag?.value === true
}

const setDevDataSeededFlag = async (): Promise<void> => {
    const flagRepo = databaseConnection.getRepository(FlagEntity)

    await flagRepo.save({
        id: DEV_DATA_SEEDED_FLAG,
        value: true,
    })
}

const seedDevUser = async (): Promise<void> => {
    const DEV_EMAIL = 'dev@ap.com'
    const DEV_PASSWORD = '12345678'


    await authenticationService.signUp({
        email: DEV_EMAIL,
        password: DEV_PASSWORD,
        firstName: 'Dev',
        lastName: 'User',
        trackEvents: false,
        newsLetter: false,
        verified: true,
        platformId: null,
        provider: Provider.EMAIL,
    })

    logger.info({ name: 'seedDevUser' }, `email=${DEV_EMAIL} pass=${DEV_PASSWORD}`)
}

const getProdAlreadySeeded = async (): Promise<boolean> => {
    const flagRepo = databaseConnection.getRepository(FlagEntity)
    const devSeedsFlag = await flagRepo.findOneBy({ id: PROD_DATA_SEEDED_FLAG })
    logger.info({ name: 'prod seed data' }, 'not seeded')
    return devSeedsFlag?.value === true
}

const getPiecesAlreadySeeded = async (): Promise<boolean> => {
    const flagRepo = databaseConnection.getRepository(FlagEntity)
    const devSeedsFlag = await flagRepo.findOneBy({ id: PIECES_DATA_SEEDED_FLAG })
    logger.info({ name: 'pieces seed data' }, 'not seeded')
    return devSeedsFlag?.value === true
}

const piecesInstalled = [
    ['@activepieces/piece-google-sheets', '0.10.6'],
    ['@activepieces/piece-openai', '0.3.25'],
    ['@activepieces/piece-store', '0.5.1'],
    ['@activepieces/piece-wordpress', '0.3.14'],
    ['@activepieces/piece-gmail', '0.7.0'],
    ['@activepieces/piece-typeform', '0.3.4'],
    ['@activepieces/piece-json', '0.0.2'],
    ['@activepieces/piece-mailchimp', '0.3.6'],
    ['@activepieces/piece-sendgrid', '0.3.4'],
    ['@activepieces/piece-schedule', '0.1.5'],
    ['@activepieces/piece-open-router', '0.0.8'],
    ['@activepieces/piece-twilio', '0.3.4'],
    ['@activepieces/piece-twitter', '0.2.7'],
    ['@activepieces/piece-zendesk', '0.1.4'],
    ['@activepieces/piece-rss', '0.3.7'],
    ['@activepieces/piece-telegram-bot', '0.3.14'],
    ['@activepieces/piece-airtable', '0.4.16'],
    ['@activepieces/piece-webhook', '0.0.1'],
]

const setPiecesSeedData = async (): Promise<boolean> => {

    const projectRepo = databaseConnection.getRepository(ProjectEntity)

    const devSeedsFlag = await projectRepo.findOneBy({ notifyStatus: NotificationStatus.ALWAYS })

    const projectId = devSeedsFlag?.id != null ? devSeedsFlag?.id : 'test'

    for (const [pieceName, pieceVersion] of piecesInstalled) {
        const params = {
            packageType: PackageType.REGISTRY,
            scope: PieceScope.PLATFORM,
            pieceName,
            pieceVersion,
            pieceArchive: null,
        }

        await pieceService
            .installPiece(devSeedsFlag?.platformId, projectId, ...[params])
    }

    const flagRepo = databaseConnection.getRepository(FlagEntity)

    await flagRepo.save({
        id: PIECES_DATA_SEEDED_FLAG,
        value: true,
    })

    logger.info({ name: 'pieces seed data' }, 'successfully seeded')
    return true
}

const setProdDataSeededFlag = async (): Promise<void> => {
    const flagRepo = databaseConnection.getRepository(FlagEntity)

    await flagRepo.save({
        id: PROD_DATA_SEEDED_FLAG,
        value: true,
    })
    logger.info({ name: 'prod seed data' }, 'seeded successfully')
}

const seedProdUser = async (): Promise<void> => {
    const DEV_EMAIL = 'developer@yuniq.com'
    const DEV_PASSWORD = '12345678'


    await authenticationService.signUp({
        email: DEV_EMAIL,
        password: DEV_PASSWORD,
        firstName: 'developer',
        lastName: 'yuniq',
        trackEvents: false,
        newsLetter: false,
        verified: true,
        platformId: null,
        provider: Provider.EMAIL,
    })

    logger.info({ name: 'seedProdUser' }, `email=${DEV_EMAIL} pass=${DEV_PASSWORD}`)
}

export const seedDevData = async (): Promise<void> => {
    if (currentEnvIsNotDev()) {
        logger.info({ name: 'seedDevData' }, 'skip: not in development environment!')
        if (!await getProdAlreadySeeded()) {
            await seedProdUser()
            await setProdDataSeededFlag()
        }
        if (!await getPiecesAlreadySeeded()) {
            await setPiecesSeedData()
        }
        return
    }

    if (await devDataAlreadySeeded()) {
        if (!await getPiecesAlreadySeeded()) {
            await setPiecesSeedData()
        }
        logger.info({ name: 'seedDevData' }, 'skip: already seeded')
        return
    }

    await seedDevUser()
    await setDevDataSeededFlag()
}
