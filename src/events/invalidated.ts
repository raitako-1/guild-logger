import { Events,  } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.Invalidated,
  once: false,
  execute: async (ctx: AppContext): Promise<void> => {
    ctx.logger.debug('fire')
  },
}
