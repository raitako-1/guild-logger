import { TextChannel, Guild, PermissionsBitField } from 'discord.js'
import { type AppContext, env } from '../util/config'

export const census = async (ctx: AppContext): Promise<void> => {
  const logChannel = await ctx.client.channels.fetch(env.BOT_LOG_CHANNEL_ID) as TextChannel
  ctx.logger.info('Starting census script...')
  await logChannel.send('Starting census script...')

  let joinnedGuilds: string = 'top of client.guilds\n\n'
  for (const joinnedGuildId of ctx.client.guilds.cache.map(guild => guild.id)) {
    const joinnedGuild: Guild = await ctx.client.guilds.fetch(joinnedGuildId)
    if (typeof joinnedGuild !== 'undefined') {
      joinnedGuilds = joinnedGuilds + joinnedGuild.name
      if (joinnedGuild.id === env.TARGET_GUILD_ID) joinnedGuilds = joinnedGuilds + " <- targeted"
      joinnedGuilds = joinnedGuilds + "\n> id = " + joinnedGuild.id + "\n> population = " + joinnedGuild.memberCount + "\n> permissions = "
      if (joinnedGuild.members.me?.permissions.has(PermissionsBitField.Flags.ViewChannel)) {
        joinnedGuilds = joinnedGuilds + "true"
      } else {
        joinnedGuilds = joinnedGuilds + "false"
      }
      joinnedGuilds = joinnedGuilds + "\n> administrator = "
      if (joinnedGuild.members.me?.permissions.has(PermissionsBitField.Flags.Administrator)) {
        joinnedGuilds = joinnedGuilds + "true"
      } else {
        joinnedGuilds = joinnedGuilds + "false"
      }
      joinnedGuilds = joinnedGuilds + "\n\n"
    }
  }
  joinnedGuilds = joinnedGuilds + "bottom"
  await logChannel.send(joinnedGuilds)
  ctx.logger.info(`Checking targetGuild...`)
  const targetGuild = await ctx.client.guilds.fetch(env.TARGET_GUILD_ID)
  if (!targetGuild) {
    if (env.TARGET_GUILD_ID) {
      ctx.logger.warn('Cannot read the TargetGuild you specified!')
      await logChannel.send('Warn: **Cannot read the TargetGuild you specified!**')
      return
    } else {
      ctx.logger.error('TARGET_GUILD_ID is not set to .env!')
      await logChannel.send('Error [SettingsError]: **Set TARGET_GUILD_ID to .env!**')
      return
    }
  }
  ctx.logger.debug('targetGuild is OK!')
  await logChannel.send('targetGuild is OK!')

  const TGChannels = await targetGuild.channels.fetch()
  let channelsString: string = "top of channels of targetGuild\n\n"
  for (const TGChannel of TGChannels) {
    if (TGChannel[1]) {
      if (!TGChannel[1].parent) {
        if (TGChannel[1].type === 0) {
          channelsString = channelsString + "#" + TGChannel[1].name + "\n"
        } else if (TGChannel[1].type === 2) {
          channelsString = channelsString + "<" + TGChannel[1].name + "\n"
        }
      }
    }
  }
  channelsString = channelsString + "\n"
  for (const TGChannel of TGChannels) {
    if (TGChannel[1] && TGChannel[1].type === 4) {
      channelsString = channelsString + TGChannel[1].name + "\n"
      for (const TGCChildren of TGChannel[1].children.cache) {
        if (TGCChildren[1].type === 0) {
          channelsString = channelsString + "> #" + TGCChildren[1].name + "\n"
        } else if (TGCChildren[1].type === 2) {
          channelsString = channelsString + "> <" + TGCChildren[1].name + "\n"
        }
      }
      channelsString = channelsString + "\n"
    }
  }
  channelsString = channelsString + "bottom"
  await logChannel.send(channelsString)

  let membersString = "top of members of targetGuild\n\n"
    for (const TGMember of targetGuild.members.cache) {
      if (TGMember[1] === targetGuild.members.me) {
        membersString = membersString + TGMember[1].displayName + " <- This bot\n\n"
      } else {
        membersString = membersString + TGMember[1].displayName + "\n\n"
      }
    }
    membersString = membersString + "bottom"
  await logChannel.send(membersString)

  await logChannel.send('census script => done!')
  ctx.logger.info('census script => done!')
}
