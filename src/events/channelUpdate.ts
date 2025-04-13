import { Events, DMChannel, type NonThreadGuildBasedChannel } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.ChannelUpdate,
  once: false,
  execute: async (ctx: AppContext, oldChannel: DMChannel | NonThreadGuildBasedChannel, newChannel: DMChannel | NonThreadGuildBasedChannel): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(oldChannel)
      console.log(newChannel)
    }
  },
}
