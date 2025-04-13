import { Events, GuildMember, type PartialGuildMember } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.GuildMemberAvailable,
  once: false,
  execute: async (ctx: AppContext, member: GuildMember | PartialGuildMember): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(member)
  },
}
