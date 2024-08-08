import { flowTimeoutSandbox, system, SystemProp, webhookSecretsUtils } from '@activepieces/server-shared'
import { ApEdition, ApFlagId, Flag, isNil } from '@activepieces/shared'
import { webhookUtils } from 'server-worker'
import { databaseConnection } from '../database/database-connection'
import { FlagEntity } from './flag.entity'
import { defaultTheme } from './theme'

const flagRepo = databaseConnection.getRepository(FlagEntity)

export const flagService = {
    save: async (flag: FlagType): Promise<Flag> => {
        return flagRepo.save({
            id: flag.id,
            value: flag.value,
        })
    },
    async getOne(flagId: ApFlagId): Promise<Flag | null> {
        return flagRepo.findOneBy({
            id: flagId,
        })
    },
    async getAll(): Promise<Flag[]> {
        const flags = await flagRepo.find({})
        const now = new Date().toISOString()
        const created = now
        const updated = now
        const currentVersion = await this.getCurrentRelease()
        const latestVersion = await this.getCurrentRelease()
        flags.push(
            {
                id: ApFlagId.ENVIRONMENT,
                value: system.get(SystemProp.ENVIRONMENT),
                created,
                updated,
            },
            {
                id: ApFlagId.IS_CLOUD_PLATFORM,
                value: false,
                created,
                updated,
            },
            {
                id: ApFlagId.PIECES_SYNC_MODE,
                value: system.get(SystemProp.PIECES_SYNC_MODE),
                created,
                updated,
            },
            {
                id: ApFlagId.SHOW_PLATFORM_DEMO,
                value: [ApEdition.CLOUD].includes(system.getEdition()),
                created,
                updated,
            },
            {
                id: ApFlagId.OWN_AUTH2_ENABLED,
                value: true,
                created,
                updated,
            },
            {
                id: ApFlagId.SHOW_REWARDS,
                value: true,
                created,
                updated,
            },
            {
                id: ApFlagId.CLOUD_AUTH_ENABLED,
                value: system.getBoolean(SystemProp.CLOUD_AUTH_ENABLED) ?? true,
                created,
                updated,
            },
            {
                id: ApFlagId.PROJECT_LIMITS_ENABLED,
                value: false,
                created,
                updated,
            },
            {
                id: ApFlagId.COPILOT_ENABLED,
                value: !isNil(system.get(SystemProp.OPENAI_API_KEY)),
                created,
                updated,
            },
            {
                id: ApFlagId.SHOW_COPILOT,
                value: true,
                created,
                updated,
            },
            {
                id: ApFlagId.INSTALL_PROJECT_PIECES_ENABLED,
                value: true,
                created,
                updated,
            },
            {
                id: ApFlagId.MANAGE_PROJECT_PIECES_ENABLED,
                value: false,
                created,
                updated,
            },
            {
                id: ApFlagId.SHOW_SIGN_UP_LINK,
                value: true,
                created,
                updated,
            },
            {
                id: ApFlagId.EDITION,
                value: system.getEdition(),
                created,
                updated,
            },
            {
                id: ApFlagId.SHOW_BILLING,
                value: system.getEdition() === ApEdition.CLOUD,
                created,
                updated,
            },
            {
                id: ApFlagId.THIRD_PARTY_AUTH_PROVIDERS_TO_SHOW_MAP,
                value: {},
                created,
                updated,
            },
            {
                id: ApFlagId.THIRD_PARTY_AUTH_PROVIDER_REDIRECT_URL,
                value: [ApEdition.CLOUD, ApEdition.ENTERPRISE].includes(system.getEdition())
                    ? this.getThirdPartyRedirectUrl(undefined, undefined)
                    : undefined,
                created,
                updated,
            },
            {
                id: ApFlagId.EMAIL_AUTH_ENABLED,
                value: true,
                created,
                updated,
            },
            {
                id: ApFlagId.THEME,
                value: defaultTheme,
                created,
                updated,
            },
            {
                id: ApFlagId.SHOW_DOCS,
                value: system.getEdition() !== ApEdition.ENTERPRISE,
                created,
                updated,
            },
            {
                id: ApFlagId.SHOW_COMMUNITY,
                value: system.getEdition() !== ApEdition.ENTERPRISE,
                created,
                updated,
            },
            {
                id: ApFlagId.PRIVATE_PIECES_ENABLED,
                value: true,
                created,
                updated,
            },
            // {
            //     id: ApFlagId.PRIVACY_POLICY_URL,
            //     value: 'https://www.activepieces.com/privacy',
            //     created,
            //     updated,
            // },
            // {
            //     id: ApFlagId.TERMS_OF_SERVICE_URL,
            //     value: 'https://www.activepieces.com/terms',
            //     created,
            //     updated,
            // },
            {
                id: ApFlagId.TELEMETRY_ENABLED,
                value: system.getBoolean(SystemProp.TELEMETRY_ENABLED) ?? false,
                created,
                updated,
            },
            {
                id: ApFlagId.WEBHOOK_URL_PREFIX,
                value: await webhookUtils.getWebhookPrefix(),
                created,
                updated,
            },
            {
                id: ApFlagId.FRONTEND_URL,
                value: system.get(SystemProp.FRONTEND_URL),
                created,
                updated,
            },
            {
                id: ApFlagId.FLOW_RUN_TIME_SECONDS,
                value: flowTimeoutSandbox,
                created,
                updated,
            },
            {
                id: ApFlagId.CURRENT_VERSION,
                value: currentVersion,
                created,
                updated,
            },
            {
                id: ApFlagId.LATEST_VERSION,
                value: latestVersion,
                created,
                updated,
            },
            {
                id: ApFlagId.SUPPORTED_APP_WEBHOOKS,
                value: webhookSecretsUtils.getSupportedAppWebhooks(),
                created,
                updated,
            },

        )

        return flags
    },
    getThirdPartyRedirectUrl(
        platformId: string | undefined,
        hostname: string | undefined,
    ): string {
        const isCustomerPlatform =
            platformId && !flagService.isCloudPlatform(platformId)
        if (isCustomerPlatform) {
            return `https://${hostname}/redirect`
        }
        const frontendUrl = system.get(SystemProp.FRONTEND_URL)
        const trimmedFrontendUrl = frontendUrl?.endsWith('/')
            ? frontendUrl.slice(0, -1)
            : frontendUrl
        return `${trimmedFrontendUrl}/redirect`
    },
    async getCurrentRelease(): Promise<string> {
        const packageJson = await import('package.json')
        return packageJson.version
    },
    // async getLatestRelease(): Promise<string> {
    //     try {
    //         const response = await axios.get<PackageJson>(
    //             'https://raw.githubusercontent.com/activepieces/activepieces/main/package.json',
    //         )
    //         return response.data.version
    //     }
    //     catch (ex) {
    //         return '0.0.0'
    //     }
    // },
    isCloudPlatform(platformId: string | null): boolean {
        const cloudPlatformId = system.get(SystemProp.CLOUD_PLATFORM_ID)
        if (!cloudPlatformId || !platformId) {
            return false
        }
        return platformId === cloudPlatformId
    },
}

export type FlagType =
    | BaseFlagStructure<ApFlagId.FRONTEND_URL, string>
    | BaseFlagStructure<ApFlagId.TELEMETRY_ENABLED, boolean>
    | BaseFlagStructure<ApFlagId.USER_CREATED, boolean>
    | BaseFlagStructure<ApFlagId.WEBHOOK_URL_PREFIX, string>

type BaseFlagStructure<K extends ApFlagId, V> = {
    id: K
    value: V
}
