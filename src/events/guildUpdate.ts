import { Events, Guild } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.GuildUpdate,
  once: false,
  execute: async (ctx: AppContext, oldGuild: Guild, newGuild: Guild): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(oldGuild)
      console.log(newGuild)
    }
  },
}
