import { Events, GuildEmoji } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.GuildEmojiUpdate,
  once: false,
  execute: async (ctx: AppContext, oldEmoji: GuildEmoji, newEmoji: GuildEmoji): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(oldEmoji)
      console.log(newEmoji)
    }
  },
}
