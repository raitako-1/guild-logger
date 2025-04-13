import {
  Events,
  type OmitPartialGroupDMChannel,
  Message,
  type PartialMessage,
  type ReadonlyCollection,
  type Snowflake,
  MessageReaction,
} from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.MessageReactionRemoveAll,
  once: false,
  execute: async (ctx: AppContext, message: OmitPartialGroupDMChannel<Message | PartialMessage>, reactions: ReadonlyCollection<string | Snowflake, MessageReaction>): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(message)
      console.log(reactions)
    }
  },
}
