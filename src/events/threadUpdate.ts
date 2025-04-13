import { Events, type AnyThreadChannel } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.ThreadUpdate,
  once: false,
  execute: async (ctx: AppContext, oldThread: AnyThreadChannel, newThread: AnyThreadChannel): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(oldThread)
      console.log(newThread)
    }
  },
}
