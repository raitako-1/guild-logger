import { Events, type AnyThreadChannel } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.ThreadDelete,
  once: false,
  execute: async (ctx: AppContext, thread: AnyThreadChannel): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(thread)
  },
}
