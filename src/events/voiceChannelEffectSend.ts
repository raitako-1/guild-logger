import { Events, VoiceChannelEffect } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.VoiceChannelEffectSend,
  once: false,
  execute: async (ctx: AppContext, voiceChannelEffect: VoiceChannelEffect): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(voiceChannelEffect)
  },
}
