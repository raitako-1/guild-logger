import { Events, Invite } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.InviteDelete,
  once: false,
  execute: async (ctx: AppContext, invite: Invite): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(invite)
  },
}
