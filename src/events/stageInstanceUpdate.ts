import { Events, StageInstance } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.StageInstanceUpdate,
  once: false,
  execute: async (ctx: AppContext, oldStageInstance: StageInstance | null, newStageInstance: StageInstance): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(oldStageInstance)
      console.log(newStageInstance)
    }
  },
}
