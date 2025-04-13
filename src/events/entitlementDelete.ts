import { Events, Entitlement } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.EntitlementDelete,
  once: false,
  execute: async (ctx: AppContext, entitlement: Entitlement): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(entitlement)
  },
}
