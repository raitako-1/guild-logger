import { Events, Guild } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.GuildIntegrationsUpdate,
  once: false,
  execute: async (ctx: AppContext, guild: Guild): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(guild)
  },
}
