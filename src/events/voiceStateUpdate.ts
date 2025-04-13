import { Events, VoiceState, TextChannel, EmbedBuilder } from 'discord.js'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.VoiceStateUpdate,
  once: false,
  execute: async (ctx: AppContext, oldState: VoiceState, newState: VoiceState): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(oldState)
      console.log(newState)
    }

    const logChannel = await ctx.client.channels.fetch(env.BOT_LOG_CHANNEL_ID) as TextChannel
    const targetGuild = await ctx.client.guilds.fetch(env.TARGET_GUILD_ID)

    if (newState.guild === targetGuild && oldState.guild === targetGuild && newState.member) {
      const embed = new EmbedBuilder()
        .setTitle('voiceStateUpdate')
        .setColor(newState.member.displayHexColor)
        .setAuthor({
          name: `${newState.member.displayName}\n${newState.member.user.tag}${newState.member.user.bot ? ' [BOT]': ''}`,
          url: `https://discord.com/users/${newState.member.id}`,
          iconURL: newState.member.displayAvatarURL()
        })
        .setFooter({
          text: new Date().toString(),
          iconURL: 'https://www.raitako.com/img/raitako_icon.jpg'
        })
        /*if message.author.display_icon != None:
            embed.set_thumbnail(url=message.author.display_icon.url)*/
      const oldStateJson = JSON.parse(JSON.stringify(oldState.toJSON()), (key, value) => {
        if (value != null) {
          return value
        }
        return false
      })
      const newStateJson = JSON.parse(JSON.stringify(newState.toJSON()), (key, value) => {
        if (value != null) {
          return value
        }
        return false
      })
      if (oldState.channelId === null && newState.channelId !== null) {
        let descriptionString = ""
        for (const newStateKey of Object.keys(newStateJson)) {
          if (newStateJson[newStateKey]) {
            descriptionString = descriptionString + newStateKey + " => " + newStateJson[newStateKey] + "\n"
          }
        }
        embed.setDescription(descriptionString)
        embed.setURL('https://discord.com/channels/' + newState.guild.id + '/' + newState.channelId)
        embed.addFields({name: "channel", value: "<" + newState.channel?.name})
        if (newState.channel?.parent?.name) {
          embed.addFields({name: "category", value: newState.channel.parent.name})
        }
        await logChannel.send({embeds: [embed]})
      /*} else if (oldState.channelId !== null && newState.channelId === null) {
        embed.setDescription('disconnect')
        embed.setURL('https://discord.com/channels/' + oldState.guild.id + '/' + oldState.channelId)
        embed.addFields({name: "channel", value: "<" + oldState.channel?.name})
        if (oldState.channel?.parent?.name) {
          embed.addFields({name: "category", value: oldState.channel.parent.name})
        }
        await LogChannel.send({embeds: [embed]})*/
      } else {
        let descriptionString = ""
        for (const oldStateKey of Object.keys(oldStateJson)) {
          if (oldStateJson[oldStateKey] !== newStateJson[oldStateKey]) {
            descriptionString = descriptionString + oldStateKey + " => " + newStateJson[oldStateKey] + "\n"
          }
        }
        embed.setDescription(descriptionString)
        embed.setURL('https://discord.com/channels/' + newState.guild.id + '/' + newState.channelId)
        if (newState.channel?.name) {
          embed.addFields({name: "channel", value: "<" + newState.channel.name})
        } else if (oldState.channel?.name) {
          embed.addFields({name: "channel", value: "<" + oldState.channel.name})
        }
        if (newState.channel?.parent?.name) {
          embed.addFields({name: "category", value: newState.channel.parent.name})
        } else if (oldState.channel?.parent?.name) {
          embed.addFields({name: "category", value: oldState.channel.parent.name})
        }
        await logChannel.send({embeds: [embed]})
      }
    }
  },
}
