import { Events, type ReadonlyCollection, type Snowflake, type AnyThreadChannel, Guild } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.ThreadListSync,
  once: false,
  execute: async (ctx: AppContext, threads: ReadonlyCollection<Snowflake, AnyThreadChannel>, guild: Guild): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(threads)
      console.log(guild)
    }
  },
}
