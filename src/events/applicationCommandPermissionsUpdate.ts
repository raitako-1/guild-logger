import { Events, type ApplicationCommandPermissionsUpdateData, TextChannel, EmbedBuilder } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.ApplicationCommandPermissionsUpdate,
  once: false,
  execute: async (ctx: AppContext, data: ApplicationCommandPermissionsUpdateData): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(data)

    const logChannel = await ctx.client.channels.fetch(env.BOT_LOG_CHANNEL_ID) as TextChannel
    const targetGuild = await ctx.client.guilds.fetch(env.TARGET_GUILD_ID)

    if (data.guildId === targetGuild.id) {
      const application = await targetGuild.members.fetch(data.applicationId)
      const embed = new EmbedBuilder()
        .setColor(application.displayHexColor)
        .setTitle('applicationCommandPermissionsUpdate')
        .setURL('https://discord.com/channels/' + data.guildId)
        .setAuthor({
          name: `${application.displayName}\n${application.user.tag}${application.user.bot ? ' [BOT]': ''}`,
          url: `https://discord.com/users/${data.applicationId}`,
          iconURL: application.displayAvatarURL()
        })
        .setDescription('```json\npermissions: ' + JSON.stringify(data.permissions, null, 4) + '\n```')
        .setFooter({
          text: new Date().toString(),
          iconURL: 'https://www.raitako.com/img/raitako_icon.jpg'
        })
        /*if message.author.display_icon != None:
            embed.set_thumbnail(url=message.author.display_icon.url)*/
      await logChannel.send({embeds: [embed]})
    }
  },
}
