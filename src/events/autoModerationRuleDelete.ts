import { Events, AutoModerationRule } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.AutoModerationRuleDelete,
  once: false,
  execute: async (ctx: AppContext, autoModerationRule: AutoModerationRule): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(autoModerationRule)
  },
}
