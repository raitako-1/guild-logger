import { Events, Sticker } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.GuildStickerUpdate,
  once: false,
  execute: async (ctx: AppContext, oldSticker: Sticker, newSticker: Sticker): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(oldSticker)
      console.log(newSticker)
    }
  },
}
