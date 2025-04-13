import { Events, ThreadMember } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.ThreadMemberUpdate,
  once: false,
  execute: async (ctx: AppContext, oldMember: ThreadMember, newMember: ThreadMember): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(oldMember)
      console.log(newMember)
    }
  },
}
