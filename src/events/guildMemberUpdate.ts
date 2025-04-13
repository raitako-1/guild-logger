import { Events, GuildMember, type PartialGuildMember } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.GuildMemberUpdate,
  once: false,
  execute: async (ctx: AppContext, oldMember: GuildMember | PartialGuildMember, newMember: GuildMember): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(oldMember)
      console.log(newMember)
    }
  },
}
