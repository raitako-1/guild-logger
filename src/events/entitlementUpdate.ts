import { Events, Entitlement } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.EntitlementUpdate,
  once: false,
  execute: async (ctx: AppContext, oldEntitlement: Entitlement | null, newEntitlement: Entitlement): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(oldEntitlement)
      console.log(newEntitlement)
    }
  },
}
