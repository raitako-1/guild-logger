import { Events } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.ShardError,
  once: false,
  execute: async (ctx: AppContext, error: Error, shardId: number): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(error)
      console.log(shardId)
    }
  },
}
