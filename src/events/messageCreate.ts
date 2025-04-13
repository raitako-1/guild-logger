import {
  Events,
  type OmitPartialGroupDMChannel,
  Message,
  TextChannel,
  EmbedBuilder,
  Embed,
} from 'discord.js'
import fs from 'fs'
import path from 'path'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.MessageCreate,
  once: false,
  execute: async (ctx: AppContext, message: OmitPartialGroupDMChannel<Message>): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) console.log(message)

    const logChannel = await ctx.client.channels.fetch(env.BOT_LOG_CHANNEL_ID) as TextChannel
    const targetGuild = await ctx.client.guilds.fetch(env.TARGET_GUILD_ID)

    if (message.author.id === ctx.client.user?.id && message.channel === logChannel) {
      return
    }
    if (message.guild === targetGuild) {
      if (message.channel.type === 0 || message.channel.type === 2) {
        if (message.member) {
          const data = JSON.parse(fs.readFileSync(path.resolve(env.JSON_PATH), 'utf8'))
          const embed = new EmbedBuilder()
            .setTitle(`messageCreate${message.system ? ' [System]': ''}`)
            .setColor(message.member.displayHexColor)
            .setURL(`https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`)
            .setAuthor({
              name: `${message.member.displayName}\n${message.author.tag}${message.author.bot ? ' [BOT]': ''}`,
              url: `https://discord.com/users/${message.author.id}`,
              iconURL: message.member.displayAvatarURL()
            })
            .setFooter({
              text: message.createdAt.toString(),
              iconURL: 'https://www.raitako.com/img/raitako_icon.jpg'
            })
          const attachmenturls = message.attachments.map(attachment => attachment.url)
          if (attachmenturls.length > 0) {
            embed.setImage(attachmenturls[0])
          }
          /*if message.author.display_icon != None:
              embed.set_thumbnail(url=message.author.display_icon.url)*/
          if (message.content) {
            embed.setDescription(message.content)
          } else if (message.type === 6) {
            embed.setDescription('This message was pinned.')
          }
          if (message.channel.type === 0) {
            embed.addFields({name: 'channel', value: `#${message.channel.name}`})
          } else if (message.channel.type === 2) {
            embed.addFields({name: 'channel', value: `<${message.channel.name}`})
          }
          if (message.channel.parent?.name) {
            embed.addFields({name: 'category', value: message.channel.parent.name})
          }
          var embeds: (Embed | EmbedBuilder)[] = [embed]
          for (const messageEmbed of message.embeds) {
            embeds.push(messageEmbed)
          }
          let msg: OmitPartialGroupDMChannel<Message<true>>
          if (message.reference?.messageId) {
            try {
              const reference_message = await logChannel.messages.fetch(data.rm[message.reference.messageId])
              msg = await reference_message.reply({embeds: embeds})
            } catch {
              msg = await logChannel.send({content: 'リプライ先が読み込めませんでした...', embeds: embeds})
            }
          } else{
            msg = await logChannel.send({embeds: embeds})
          }
          if (attachmenturls.length < 12 && attachmenturls.length > 1) {
            attachmenturls.forEach(async (element, index) => {
              if (index === 0) {
                await msg.react("1️⃣")
              }
              if (index === 1) {
                await msg.react("2️⃣")
              }
              if (index === 2) {
                await msg.react("3️⃣")
              }
              if (index === 3) {
                await msg.react("4️⃣")
              }
              if (index === 4) {
                await msg.react("5️⃣")
              }
              if (index === 5) {
                await msg.react("6️⃣")
              }
              if (index === 6) {
                await msg.react("7️⃣")
              }
              if (index === 7) {
                await msg.react("8️⃣")
              }
              if (index === 8) {
                await msg.react("9️⃣")
              }
              if (index === 9) {
                await msg.react("🔟")
              }
            })
          }
          data.rm[message.id] = msg.id
          data.mr[msg.id] = {
            id: message.id,
            channelId: message.channelId
          }
          const json = JSON.stringify(data, null, 2)
          fs.writeFileSync(path.resolve(env.JSON_PATH), json)
        }
      }
    }
  },
}
