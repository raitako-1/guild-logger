import { Events } from 'discord.js'
import { type AppContext } from '../util/config'

export default {
	name: Events.CacheSweep,
	once: false,
	execute: async (ctx: AppContext, message: string): Promise<void> => {
    ctx.logger.info(message)
	},
}
