import { Events, User, type PartialUser } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.UserUpdate,
  once: false,
  execute: async (ctx: AppContext, oldUser: User | PartialUser, newUser: User): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(oldUser)
      console.log(newUser)
    }
  },
}
