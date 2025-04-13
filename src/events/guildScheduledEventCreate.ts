import { Events, GuildScheduledEvent } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.GuildScheduledEventCreate,
  once: false,
  execute: async (ctx: AppContext, guildScheduledEvent: GuildScheduledEvent): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(guildScheduledEvent)
  },
}
