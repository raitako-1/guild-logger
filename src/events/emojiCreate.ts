import { Events, GuildEmoji } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.GuildEmojiCreate,
  once: false,
  execute: async (ctx: AppContext, emoji: GuildEmoji): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(emoji)
  },
}
