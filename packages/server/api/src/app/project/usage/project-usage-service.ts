import { system, SystemProp } from '@activepieces/server-shared'
import { ApEnvironment, ProjectUsage } from '@activepieces/shared'
import { getRedisConnection } from '../../database/redis-connection'
// import { projectMemberService } from '../../ee/project-members/project-member.service'
import { apDayjs } from '../../helper/dayjs-helper'
import { userInvitationsService } from '../../user-invitations/user-invitation.service'
import { projectService } from '../project-service'

export const projectUsageService = {
    async getUsageForBillingPeriod(projectId: string, startBillingPeriod: string): Promise<ProjectUsage> {
        const flowTasks = await getTasksUsage(projectId, getCurrentingStartPeriod(startBillingPeriod))
        // const teamMembers = await projectMemberService.countTeamMembers(projectId) + await userInvitationsService.countByProjectId(projectId)
        const teamMembers = await userInvitationsService.countByProjectId(projectId)
        return {
            tasks: flowTasks,
            teamMembers,
        }
    },
    increaseTasks,
    getCurrentingStartPeriod,
    getCurrentingEndPeriod,
}

function getCurrentingStartPeriod(datetime: string): string {
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000
    const date = apDayjs(datetime)
    const currentDate = apDayjs()
    const nextResetInMs = (currentDate.diff(date, 'millisecond') % thirtyDaysInMs)
    return currentDate.subtract(nextResetInMs, 'millisecond').toISOString()
}

function getCurrentingEndPeriod(datetime: string): string {
    return apDayjs(getCurrentingStartPeriod(datetime)).add(30, 'days').toISOString()
}

async function increaseTasks(projectId: string, incrementBy: number): Promise<number> {
    const project = await projectService.getOneOrThrow(projectId)
    const startBillingPeriod = getCurrentingStartPeriod(project.created)
    return incrementOrCreateRedisRecord(projectId, startBillingPeriod, incrementBy)
}

async function incrementOrCreateRedisRecord(projectId: string, startBillingPeriod: string, incrementBy: number): Promise<number> {
    const environment = system.get(SystemProp.ENVIRONMENT)
    if (environment === ApEnvironment.TESTING) {
        return 0
    }
    const key = constructUsageKey(projectId, startBillingPeriod)
    return getRedisConnection().incrby(key, incrementBy)
}

async function getTasksUsage(projectId: string, startBillingPeriod: string): Promise<number> {
    const environment = system.get(SystemProp.ENVIRONMENT)
    if (environment === ApEnvironment.TESTING) {
        return 0
    }
    const key = constructUsageKey(projectId, startBillingPeriod)
    const value = await getRedisConnection().get(key)
    return Number(value) || 0
}

function constructUsageKey(projectId: string, startBillingPeriod: string): string {
    return `project-usage:${projectId}:${startBillingPeriod}`
}
