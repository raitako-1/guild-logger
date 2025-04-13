import {
  Events,
  type ReadonlyCollection,
  type Snowflake,
  type OmitPartialGroupDMChannel,
  Message,
  type PartialMessage,
  type GuildTextBasedChannel
} from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.MessageBulkDelete,
  once: false,
  execute: async (ctx: AppContext, messages: ReadonlyCollection<Snowflake, OmitPartialGroupDMChannel<Message | PartialMessage>>, channel: GuildTextBasedChannel): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(messages)
      console.log(channel)
    }
  },
}
