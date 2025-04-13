import { Events } from 'discord.js'
import { type AppContext } from '../util/config'

export default {
  name: Events.Error,
  once: false,
  execute: async (ctx: AppContext, error: Error): Promise<void> => {
    ctx.logger.error(error.message)
  },
}
