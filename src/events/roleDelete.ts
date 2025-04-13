import { Events, Role } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.GuildRoleDelete,
  once: false,
  execute: async (ctx: AppContext, role: Role): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(role)
  },
}
