import { logger, system, SystemProp } from '@activepieces/server-shared'
import { ApEnvironment } from '@activepieces/shared'
import { FastifyInstance } from 'fastify'
import { flowWorker } from 'server-worker'
import { setupApp } from './app/app'
import { databaseConnection } from './app/database/database-connection'
import { seedDevData } from './app/database/seeds/dev-seeds'
// import { licenseKeysService } from './app/ee/license-keys/license-keys-service'
// import { platformService } from './app/platform/platform.service'

const start = async (app: FastifyInstance): Promise<void> => {
    try {
        await app.listen({
            host: '0.0.0.0',
            port: 3000,
        })
        await flowWorker.start()

        logger.info(`
 *******  *******    ********       ** ****     ** ********** ********   ********  *******       **     ********** ********
/**////**/**////**  **//////       /**/**/**   /**/////**/// /**/////   **//////**/**////**     ****   /////**/// /**/////
/**   /**/**    /**/**             /**/**//**  /**    /**    /**       **      // /**   /**    **//**      /**    /**
/******* /**    /**/*********      /**/** //** /**    /**    /******* /**         /*******    **  //**     /**    /*******
/**////  /**    /**////////**      /**/**  //**/**    /**    /**////  /**    *****/**///**   **********    /**    /**////
/**      /**    **        /**      /**/**   //****    /**    /**      //**  ////**/**  //** /**//////**    /**    /**
/**      /*******   ********       /**/**    //***    /**    /******** //******** /**   //**/**     /**    /**    /********
//       ///////   ////////        // //      ///     //     ////////   ////////  //     // //      //     //     ////////

The application started on ${system.get(SystemProp.FRONTEND_URL)}, as specified by the AP_FRONTEND_URL variables.`)

        const environment = system.get(SystemProp.ENVIRONMENT)
        const piecesSource = system.getOrThrow(SystemProp.PIECES_SOURCE)
        const pieces = process.env.AP_DEV_PIECES

        logger.warn(
            `[WARNING]: Pieces will be loaded from source type ${piecesSource}`,
        )
        if (environment === ApEnvironment.DEVELOPMENT) {
            logger.warn(
                `[WARNING]: The application is running in ${environment} mode.`,
            )
            logger.warn(
                `[WARNING]: This is only shows pieces specified in AP_DEV_PIECES ${pieces} environment variable.`,
            )
        }
        // const oldestPlatform = await platformService.getOldestPlatform()
        // if (!isNil(oldestPlatform)) {
        //     await licenseKeysService.verifyKeyAndApplyLimits({
        //         platformId: oldestPlatform.id,
        //         license: system.get<string>(SystemProp.LICENSE_KEY),
        //     })
        // }
    }
    catch (err) {
        logger.error(err)
        process.exit(1)
    }
}

// This might be needed as it can be called twice
let shuttingDown = false

function setupTimeZone(): void {
    // It's important to set the time zone to UTC when working with dates in PostgreSQL.
    // If the time zone is not set to UTC, there can be problems when storing dates in UTC but not considering the UTC offset when converting them back to local time. This can lead to incorrect fields being displayed for the created
    // https://stackoverflow.com/questions/68240368/typeorm-find-methods-returns-wrong-timestamp-time
    process.env.TZ = 'UTC'
}

const stop = async (app: FastifyInstance): Promise<void> => {
    if (shuttingDown) return
    shuttingDown = true

    try {
        await app.close()
        process.exit(0)
    }
    catch (err) {
        logger.error('Error stopping server')
        logger.error(err)
        process.exit(1)
    }
}

const main = async (): Promise<void> => {
    setupTimeZone()
    await databaseConnection.initialize()
    await databaseConnection.runMigrations()
    await seedDevData()
    const app = await setupApp()
    process.on('SIGINT', () => {
        stop(app).catch((e) => logger.error(e, '[Main#stop]'))
    })

    process.on('SIGTERM', () => {
        stop(app).catch((e) => logger.error(e, '[Main#stop]'))
    })

    await start(app)
}

main().catch((e) => {
    logger.error(e, '[Main#main]')
    process.exit(1)
})
