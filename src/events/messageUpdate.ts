import { Events, type OmitPartialGroupDMChannel, Message, type PartialMessage } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.MessageUpdate,
  once: false,
  execute: async (ctx: AppContext, oldMessage: OmitPartialGroupDMChannel<Message | PartialMessage>, newMessage: OmitPartialGroupDMChannel<Message>): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(oldMessage)
      console.log(newMessage)
    }
  },
}
