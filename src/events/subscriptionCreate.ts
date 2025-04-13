import { Events, Subscription } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.SubscriptionCreate,
  once: false,
  execute: async (ctx: AppContext, subscription: Subscription): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(subscription)
  },
}
