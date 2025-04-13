import { Events, GuildBan } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.GuildBanAdd,
  once: false,
  execute: async (ctx: AppContext, ban: GuildBan): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(ban)
  },
}
