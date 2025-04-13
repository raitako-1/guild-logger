import { Events, GuildMember } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.GuildMemberAdd,
  once: false,
  execute: async (ctx: AppContext, member: GuildMember): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(member)
  },
}
