import { Events, type CloseEvent } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.ShardDisconnect,
  once: false,
  execute: async (ctx: AppContext, closeEvent: CloseEvent, shardId: number): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(closeEvent)
      console.log(shardId)
    }
  },
}
