import { Events, type NonThreadGuildBasedChannel } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.ChannelCreate,
  once: false,
  execute: async (ctx: AppContext, channel: NonThreadGuildBasedChannel): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(channel)
  },
}
