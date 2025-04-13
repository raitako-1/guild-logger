import { Events, Role } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.GuildRoleUpdate,
  once: false,
  execute: async (ctx: AppContext, oldRole: Role, newRole: Role): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(oldRole)
      console.log(newRole)
    }
  },
}
