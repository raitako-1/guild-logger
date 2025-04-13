import { Events, type OmitPartialGroupDMChannel, Message, type PartialMessage } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.MessageDelete,
  once: false,
  execute: async (ctx: AppContext, message: OmitPartialGroupDMChannel<Message | PartialMessage>): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(message)
  },
}
