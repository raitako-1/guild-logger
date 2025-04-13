import { Events, DMChannel, type NonThreadGuildBasedChannel } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.ChannelDelete,
  once: false,
  execute: async (ctx: AppContext, channel: DMChannel | NonThreadGuildBasedChannel): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(channel)
  },
}
