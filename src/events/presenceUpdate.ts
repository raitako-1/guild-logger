import { Events, Presence } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.PresenceUpdate,
  once: false,
  execute: async (ctx: AppContext, oldPresence: Presence | null, newPresence: Presence): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(oldPresence)
      console.log(newPresence)
    }
  },
}
