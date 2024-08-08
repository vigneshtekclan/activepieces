// import { ApplicationEventName } from '@activepieces/ee-shared'
import { system, SystemProp } from '@activepieces/server-shared'
import {
    ALL_PRINCIPAL_TYPES,
    ApEdition,
    SignInRequest,
    SignUpRequest,
} from '@activepieces/shared'
import { RateLimitOptions } from '@fastify/rate-limit'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { eventsHooks } from '../helper/application-events'
import { resolvePlatformIdForAuthnRequest } from '../platform/platform-utils'
import { authenticationService } from './authentication-service'
import { Provider } from './authentication-service/hooks/authentication-service-hooks'

const edition = system.getEdition()

export enum ApplicationEventName {
    CREATED_FLOW = 'CREATED_FLOW',
    DELETED_FLOW = 'DELETED_FLOW',
    CREATED_FOLDER = 'CREATED_FOLDER',
    UPDATED_FOLDER = 'UPDATED_FOLDER',
    DELETED_FOLDER = 'DELETED_FOLDER',
    UPDATED_FLOW = 'UPDATED_FLOW',
    UPSERTED_CONNECTION = 'UPSERTED_CONNECTION',
    DELETED_CONNECTION = 'DELETED_CONNECTION',
    SIGNED_UP_USING_EMAIL = 'SIGNED_UP_USING_EMAIL',
    SIGNED_UP_USING_SSO = 'SIGNED_UP_USING_SSO',
    SIGNED_UP_USING_MANAGED_AUTH = 'SIGNED_UP_USING_MANAGED_AUTH',
    SIGNED_IN = 'SIGNED_IN',
    RESET_PASSWORD = 'RESET_PASSWORD',
    VERIFIED_EMAIL = 'VERIFIED_EMAIL',
    CREATED_SIGNING_KEY = 'CREATED_SIGNING_KEY',
}

export const authenticationController: FastifyPluginAsyncTypebox = async (
    app,
) => {
    app.post('/sign-up', SignUpRequestOptions, async (request) => {
        const platformId = await resolvePlatformIdForAuthnRequest(request.body.email, request)

        const signUpResponse = await authenticationService.signUp({
            ...request.body,
            verified: edition === ApEdition.COMMUNITY,
            platformId,
            provider: Provider.EMAIL,
        })

        eventsHooks.get().send(request, {
            action: ApplicationEventName.SIGNED_UP_USING_EMAIL,
            userId: request.principal.id,
            createdUser: {
                id: signUpResponse.id,
                email: signUpResponse.email,
            },
        })

        return signUpResponse
    })

    app.post('/sign-in', SignInRequestOptions, async (request) => {
        const platformId = await resolvePlatformIdForAuthnRequest(request.body.email, request)
        eventsHooks.get().send(request, {
            action: ApplicationEventName.SIGNED_IN,
            userId: request.principal.id,
        })
        return authenticationService.signIn({
            email: request.body.email,
            password: request.body.password,
            platformId,
            provider: Provider.EMAIL,
        })
    })
}

const rateLimitOptions: RateLimitOptions = {
    max: Number.parseInt(
        system.getOrThrow(SystemProp.API_RATE_LIMIT_AUTHN_MAX),
        10,
    ),
    timeWindow: system.getOrThrow(SystemProp.API_RATE_LIMIT_AUTHN_WINDOW),
}

const SignUpRequestOptions = {
    config: {
        allowedPrincipals: ALL_PRINCIPAL_TYPES,
        rateLimit: rateLimitOptions,
    },
    schema: {
        body: SignUpRequest,
    },
}

const SignInRequestOptions = {
    config: {
        allowedPrincipals: ALL_PRINCIPAL_TYPES,
        rateLimit: rateLimitOptions,
    },
    schema: {
        body: SignInRequest,
    },
}
