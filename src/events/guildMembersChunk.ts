import { Events, type ReadonlyCollection, type Snowflake, GuildMember, Guild, type GuildMembersChunk } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.GuildMembersChunk,
  once: false,
  execute: async (ctx: AppContext, members: ReadonlyCollection<Snowflake, GuildMember>, guild: Guild, data: GuildMembersChunk): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(members)
      console.log(guild)
      console.log(data)
    }
  },
}
