import {
  Events,
  type ReadonlyCollection,
  type Snowflake,
  ThreadMember,
  type PartialThreadMember,
  type AnyThreadChannel,
} from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.ThreadMembersUpdate,
  once: false,
  execute: async (ctx: AppContext, addedMembers: ReadonlyCollection<Snowflake, ThreadMember>, removedMembers: ReadonlyCollection<Snowflake, ThreadMember | PartialThreadMember>, thread: AnyThreadChannel): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(addedMembers)
      console.log(removedMembers)
      console.log(thread)
    }
  },
}
