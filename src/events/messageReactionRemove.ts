import {
  Events,
  MessageReaction,
  type PartialMessageReaction,
  User,
  type PartialUser,
  type MessageReactionEventDetails,
} from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.MessageReactionRemove,
  once: false,
  execute: async (ctx: AppContext, reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser, details: MessageReactionEventDetails): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(reaction)
      console.log(user)
      console.log(details)
    }
  },
}
