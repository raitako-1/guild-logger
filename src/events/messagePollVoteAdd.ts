import { Events, PollAnswer, type Snowflake } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.MessagePollVoteAdd,
  once: false,
  execute: async (ctx: AppContext, pollAnswer: PollAnswer, userId: Snowflake): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(pollAnswer)
      console.log(userId)
    }
  },
}
