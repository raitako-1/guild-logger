import { Events, TextChannel, NewsChannel, VoiceChannel, ForumChannel, MediaChannel } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.WebhooksUpdate,
  once: false,
  execute: async (ctx: AppContext, channel: TextChannel | NewsChannel | VoiceChannel | ForumChannel | MediaChannel): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(channel)
  },
}
