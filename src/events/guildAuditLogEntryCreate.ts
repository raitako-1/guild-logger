import { Events, GuildAuditLogsEntry, Guild } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.GuildAuditLogEntryCreate,
  once: false,
  execute: async (ctx: AppContext, auditLogEntry: GuildAuditLogsEntry, guild: Guild): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(auditLogEntry)
      console.log(guild)
    }
  },
}
