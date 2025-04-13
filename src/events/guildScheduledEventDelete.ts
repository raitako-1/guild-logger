import { Events, GuildScheduledEvent, type PartialGuildScheduledEvent } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.GuildScheduledEventDelete,
  once: false,
  execute: async (ctx: AppContext, guildScheduledEvent: GuildScheduledEvent | PartialGuildScheduledEvent): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(guildScheduledEvent)
  },
}
