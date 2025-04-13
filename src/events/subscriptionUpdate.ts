import { Events, Subscription } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.SubscriptionUpdate,
  once: false,
  execute: async (ctx: AppContext, oldSubscription: Subscription | null, newSubscription: Subscription): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(oldSubscription)
      console.log(newSubscription)
    }
  },
}
