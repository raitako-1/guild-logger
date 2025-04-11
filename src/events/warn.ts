import { Events } from 'discord.js'
import { type AppContext } from '../util/config'

export default {
	name: Events.Warn,
	once: false,
	execute: async (ctx: AppContext, info: string): Promise<void> => {
    ctx.logger.warn(info)
	},
}
