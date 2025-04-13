import { Events, MessageReaction, type PartialMessageReaction } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.MessageReactionRemoveEmoji,
  once: false,
  execute: async (ctx: AppContext, reaction: MessageReaction | PartialMessageReaction): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(reaction)
  },
}
