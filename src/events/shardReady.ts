import { Events, type Snowflake } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.ShardReady,
  once: false,
  execute: async (ctx: AppContext, shardId: number, unavailableGuilds: Set<Snowflake> | undefined): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(shardId)
      console.log(unavailableGuilds)
    }
  },
}
