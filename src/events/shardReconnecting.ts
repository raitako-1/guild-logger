import { Events } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.ShardReconnecting,
  once: false,
  execute: async (ctx: AppContext, shardId: number): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(shardId)
  },
}
