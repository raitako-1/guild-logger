import { Events, GuildScheduledEvent, type PartialGuildScheduledEvent, User } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.GuildScheduledEventUserAdd,
  once: false,
  execute: async (ctx: AppContext, guildScheduledEvent: GuildScheduledEvent | PartialGuildScheduledEvent, user: User): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(guildScheduledEvent)
      console.log(user)
    }
  },
}
