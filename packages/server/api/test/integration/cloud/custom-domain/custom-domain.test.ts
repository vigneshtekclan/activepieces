// import { AddDomainRequest, CustomDomainStatus } from '@activepieces/ee-shared'
import { apId, PrincipalType } from '@activepieces/shared'
import { faker } from '@faker-js/faker'
import { FastifyInstance } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { setupApp } from '../../../../src/app/app'
import { databaseConnection } from '../../../../src/app/database/database-connection'
import { generateMockToken } from '../../../helpers/auth'
import {
    createMockCustomDomain,
    mockBasicSetup,
} from '../../../helpers/mocks'

let app: FastifyInstance | null = null

beforeAll(async () => {
    await databaseConnection.initialize()
    app = await setupApp()
})

afterAll(async () => {
    await databaseConnection.destroy()
    await app?.close()
})

describe('Custom Domain API', () => {
    // describe('Add Custom Domain API', () => {
    //     it('should create a new custom domain', async () => {
    //         // arrange
    //         const { mockOwner, mockPlatform } = await mockBasicSetup()
    //         const testToken = await generateMockToken({
    //             type: PrincipalType.USER,
    //             id: mockOwner.id,
    //             platform: { id: mockPlatform.id },
    //         })

    //         const request: AddDomainRequest = {
    //             domain: faker.internet.domainName(),
    //         }
    //         const response = await app?.inject({
    //             method: 'POST',
    //             url: '/v1/custom-domains',
    //             body: request,
    //             headers: {
    //                 authorization: `Bearer ${testToken}`,
    //             },
    //         })

    //         // assert
    //         expect(response?.statusCode).toBe(StatusCodes.CREATED)
    //         const responseBody = response?.json()

    //         expect(responseBody.customDomain.domain).toBe(request.domain)
    //         expect(responseBody.customDomain.status).toBe(CustomDomainStatus.ACTIVE)
    //     })

    //     it('should fail if user is not platform owner', async () => {
    //         // arrange
    //         const { mockPlatform } = await mockBasicSetup()

    //         const nonOwnerUserId = apId()
    //         const testToken = await generateMockToken({
    //             type: PrincipalType.USER,
    //             id: nonOwnerUserId,
    //             platform: { id: mockPlatform.id },
    //         })

    //         const request: AddDomainRequest = {
    //             domain: faker.internet.domainName(),
    //         }
    //         const response = await app?.inject({
    //             method: 'POST',
    //             url: '/v1/custom-domains',
    //             body: request,
    //             headers: {
    //                 authorization: `Bearer ${testToken}`,
    //             },
    //         })

    //         // assert
    //         expect(response?.statusCode).toBe(StatusCodes.FORBIDDEN)
    //     })
    // })

    // describe('List Custom Domain API', () => {
    //     it('should list custom domains', async () => {
    //         // arrange
    //         const { mockOwner: mockUserOne, mockPlatform: mockPlatformOne } = await mockBasicSetup()
    //         const {  mockPlatform: mockPlatformTwo } = await mockBasicSetup()

    //         const testToken1 = await generateMockToken({
    //             type: PrincipalType.USER,
    //             id: mockUserOne.id,
    //             platform: { id: mockPlatformOne.id },
    //         })

    //         const mockCustomDomains1 = [
    //             createMockCustomDomain({
    //                 platformId: mockPlatformOne.id,
    //                 domain: faker.internet.domainName(),
    //             }),
    //             createMockCustomDomain({
    //                 platformId: mockPlatformOne.id,
    //                 domain: faker.internet.domainName(),
    //             }),
    //         ]
    //         await databaseConnection
    //             .getRepository('custom_domain')
    //             .save(mockCustomDomains1)

    //         const mockCustomDomains2 = [
    //             createMockCustomDomain({
    //                 platformId: mockPlatformTwo.id,
    //                 domain: faker.internet.domainName(),
    //             }),
    //         ]
    //         await databaseConnection
    //             .getRepository('custom_domain')
    //             .save(mockCustomDomains2)

    //         // act
    //         const response1 = await app?.inject({
    //             method: 'GET',
    //             url: '/v1/custom-domains',
    //             headers: {
    //                 authorization: `Bearer ${testToken1}`,
    //             },
    //         })

    //         // assert
    //         expect(response1?.statusCode).toBe(StatusCodes.OK)
    //         const responseBody1 = response1?.json()

    //         expect(responseBody1.data).toHaveLength(mockCustomDomains1.length)
    //         expect(responseBody1?.data).toEqual(
    //             expect.arrayContaining([
    //                 expect.objectContaining({ id: mockCustomDomains1[0].id }),
    //                 expect.objectContaining({ id: mockCustomDomains1[1].id }),
    //             ]),
    //         )
    //     })
    // })

    // describe('Delete Custom Domain API', () => {
    //     it('should delete a custom domain', async () => {
    //         // arrange
    //         const { mockOwner: mockUserOne, mockPlatform: mockPlatformOne } = await mockBasicSetup()
    //         const testToken = await generateMockToken({
    //             type: PrincipalType.USER,
    //             id: mockUserOne.id,
    //             platform: { id: mockPlatformOne.id },
    //         })

    //         const customDomain = createMockCustomDomain({
    //             platformId: mockPlatformOne.id,
    //             domain: faker.internet.domainName(),
    //         })
    //         await databaseConnection
    //             .getRepository('custom_domain')
    //             .save(customDomain)

    //         // act
    //         const response = await app?.inject({
    //             method: 'DELETE',
    //             url: `/v1/custom-domains/${customDomain.id}`,
    //             headers: {
    //                 authorization: `Bearer ${testToken}`,
    //             },
    //         })

    //         // assert
    //         expect(response?.statusCode).toBe(StatusCodes.OK)
    //     })

    //     it('should fail to delete a custom domain if user is not platform owner', async () => {
    //         const { mockPlatform: mockPlatformOne } = await mockBasicSetup()
    //         const nonOwnerUserId = apId()
    //         const testToken = await generateMockToken({
    //             type: PrincipalType.USER,
    //             id: nonOwnerUserId,
    //             platform: { id: mockPlatformOne.id },
    //         })

    //         const customDomain = createMockCustomDomain({
    //             platformId: mockPlatformOne.id,
    //             domain: faker.internet.domainName(),
    //         })
    //         await databaseConnection
    //             .getRepository('custom_domain')
    //             .save(customDomain)

    //         // act
    //         const response = await app?.inject({
    //             method: 'DELETE',
    //             url: `/v1/custom-domains/${customDomain.id}`,
    //             headers: {
    //                 authorization: `Bearer ${testToken}`,
    //             },
    //         })

    //         // assert
    //         expect(response?.statusCode).toBe(StatusCodes.FORBIDDEN)
    //     })
    // })
})
