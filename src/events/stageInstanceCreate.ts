import { Events, StageInstance } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.StageInstanceCreate,
  once: false,
  execute: async (ctx: AppContext, stageInstance: StageInstance): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(stageInstance)
  },
}
