import { Events, Sticker } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.GuildStickerDelete,
  once: false,
  execute: async (ctx: AppContext, sticker: Sticker): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(sticker)
  },
}
