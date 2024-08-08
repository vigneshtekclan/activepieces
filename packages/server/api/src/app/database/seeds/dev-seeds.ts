import { logger, system, SystemProp } from '@activepieces/server-shared'
import { ApEnvironment } from '@activepieces/shared'
import { authenticationService } from '../../authentication/authentication-service'
import { Provider } from '../../authentication/authentication-service/hooks/authentication-service-hooks'
import { FlagEntity } from '../../flags/flag.entity'
import { databaseConnection } from '../database-connection'

const DEV_DATA_SEEDED_FLAG = 'DEV_DATA_SEEDED'
const PROD_DATA_SEEDED_FLAG = 'PROD_DATA_SEEDED'

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
        return
    }

    if (await devDataAlreadySeeded()) {
        logger.info({ name: 'seedDevData' }, 'skip: already seeded')
        return
    }

    await seedDevUser()
    await setDevDataSeededFlag()
}
