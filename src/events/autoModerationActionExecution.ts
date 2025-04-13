import { Events, AutoModerationActionExecution, TextChannel, EmbedBuilder } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.AutoModerationActionExecution,
  once: false,
  execute: async (ctx: AppContext, autoModerationActionExecution: AutoModerationActionExecution): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(autoModerationActionExecution)

    const logChannel = await ctx.client.channels.fetch(env.BOT_LOG_CHANNEL_ID) as TextChannel
    const targetGuild = await ctx.client.guilds.fetch(env.TARGET_GUILD_ID)
    
    if (autoModerationActionExecution.guild === targetGuild) {
      if (autoModerationActionExecution.user && autoModerationActionExecution.member) {
        const embed = new EmbedBuilder()
          .setColor(autoModerationActionExecution.member.displayHexColor)
          .setTitle('autoModerationActionExecution')
          .setURL('https://discord.com/channels/' + autoModerationActionExecution.guild.id + '/' + autoModerationActionExecution.channelId + '/' + autoModerationActionExecution.alertSystemMessageId)
          .setAuthor({
            name: `${autoModerationActionExecution.member.displayName}\n${autoModerationActionExecution.user.tag}${autoModerationActionExecution.user.bot ? ' [BOT]': ''}`,
            url: `https://discord.com/users/${autoModerationActionExecution.userId}`,
            iconURL: autoModerationActionExecution.member.displayAvatarURL()
          })
          .setDescription('```json\n' + JSON.stringify(autoModerationActionExecution, null, 4) + '\n```')
          .addFields({name: 'channel', value: `#${autoModerationActionExecution.channel?.name}`})
          .setFooter({
            text: new Date().toString(),
            iconURL: 'https://www.raitako.com/img/raitako_icon.jpg'
          })
          /*if message.author.display_icon != None:
              embed.set_thumbnail(url=message.author.display_icon.url)*/
        if (autoModerationActionExecution.channel?.parent?.name) {
          embed.addFields({name: 'category', value: autoModerationActionExecution.channel.parent.name})
        }
        await logChannel.send({embeds: [embed]})
      }
    }
  },
}
