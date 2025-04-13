import { Events, Typing } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.TypingStart,
  once: false,
  execute: async (ctx: AppContext, typing: Typing): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(typing)
  },
}
