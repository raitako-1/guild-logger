import { Events, Client } from 'discord.js'
import cron from 'node-cron'
import { census } from '../util/census'
import { type AppContext, env } from '../util/config'
import { createLogger } from '../util/logger'

export default {
  name: Events.ClientReady,
  once: true,
  execute: async (ctx: AppContext, client: Client<true>): Promise<void> => {
    ctx.logger.info(`Logged in as ${client.user.tag}!`)    

    ctx.logger.info(`Checking channels...`)
    const logChannel = await client.channels.fetch(env.BOT_LOG_CHANNEL_ID)
    if (logChannel?.type !== 0) {
      const err: Error = new Error('The botChannel you specified is not TextChannel Class!')
      err.name = 'SettingsError'
      throw err
    }
    ctx.logger.debug(`The all channel you specified is TextChannel Class! OK!`)

    await logChannel.send(`Started ***${process.env.npm_package_name}** __${process.env.npm_package_version}__*\nPlease check /help.`)

    const censusOnReadyCtx: AppContext = {
      ...ctx,
      logger: createLogger({name: 'BOT', childs: [`evt: ${Events.ClientReady}`, 'script: census']}),
      client,
    }
    await census(censusOnReadyCtx)
    if (env.DAILY_CENSUS_SCRIPT) {
      ctx.logger.info('Setting CensusScript to crontab...')
      const censusCtx: AppContext = {
        ...ctx,
        logger: createLogger({name: 'BOT', childs: ['node-cron', 'script: census']}),
        client,
      }
      cron.schedule('0 0 0 * * *', async (): Promise<void> => await census(censusCtx))
      ctx.logger.debug('Successfully setted CensusScript to crontab.')
    }

    ctx.logger.info('Done!')
  },
}
