import { Events, Client } from 'discord.js'
import { type AppContext, env } from '../util/config'
import { convLogMsg } from '../util/logger'

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

    await logChannel.send(convLogMsg(env.BOT_ONREADY_MESSAGE))

    ctx.logger.info('Done!')
	},
}
