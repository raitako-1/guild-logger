import { Events, GuildScheduledEvent, type PartialGuildScheduledEvent } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.GuildScheduledEventUpdate,
  once: false,
  execute: async (ctx: AppContext, oldGuildScheduledEvent: GuildScheduledEvent | PartialGuildScheduledEvent | null, newGuildScheduledEvent: GuildScheduledEvent): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(oldGuildScheduledEvent)
      console.log(newGuildScheduledEvent)
    }
  },
}
