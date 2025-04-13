import { Events, AutoModerationRule } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.AutoModerationRuleUpdate,
  once: false,
  execute: async (ctx: AppContext, oldAutoModerationRule: AutoModerationRule | null, newAutoModerationRule: AutoModerationRule): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(oldAutoModerationRule)
      console.log(newAutoModerationRule)
    }
  },
}
