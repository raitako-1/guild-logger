import { Events, type TextBasedChannel } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.ChannelPinsUpdate,
  once: false,
  execute: async (ctx: AppContext, channel: TextBasedChannel, date: Date): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(channel)
      console.log(date)
    }
  },
}
