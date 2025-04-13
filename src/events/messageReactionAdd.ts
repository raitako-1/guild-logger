import {
  Events,
  MessageReaction,
  type PartialMessageReaction,
  User,
  type PartialUser,
  type MessageReactionEventDetails,
  TextChannel,
  Embed,
  EmbedBuilder,
} from 'discord.js'
import fs from 'fs'
import path from 'path'
import { type AppContext, env } from '../util/config'

export default {
  name: Events.MessageReactionAdd,
  once: false,
  execute: async (ctx: AppContext, reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser, details: MessageReactionEventDetails): Promise<void> => {
    ctx.logger.debug('fire')
    if (!env.isProduction) {
      console.log(reaction)
      console.log(user)
      console.log(details)
    }

    const logChannel = await ctx.client.channels.fetch(env.BOT_LOG_CHANNEL_ID) as TextChannel

    const data = JSON.parse(fs.readFileSync(path.resolve(env.JSON_PATH), 'utf8'))
    if (user !== ctx.client.user) {
      if (reaction.message.id in data.mr) {
        reaction.users.remove(user.id)
        const motoChannel = await ctx.client.channels.fetch(data.mr[reaction.message.id].channelId)
        if (motoChannel?.type === 0) {
          const reactionMessage = await logChannel.messages.fetch(reaction.message.id)
          const message = await motoChannel.messages.fetch(data.mr[reaction.message.id].id)
          const embeds: (Embed | EmbedBuilder)[] = [...reactionMessage.embeds]
          const embed = EmbedBuilder.from(embeds[0])
          const attachmenturls = message.attachments.map(attachment => attachment.url)
          if (reaction.emoji.name === "1️⃣") {
            embed.setImage(attachmenturls[0])
          }
          if (reaction.emoji.name === "2️⃣") {
            embed.setImage(attachmenturls[1])
          }
          if (reaction.emoji.name === "3️⃣") {
            embed.setImage(attachmenturls[2])
          }
          if (reaction.emoji.name === "4️⃣") {
            embed.setImage(attachmenturls[3])
          }
          if (reaction.emoji.name === "5️⃣") {
            embed.setImage(attachmenturls[4])
          }
          if (reaction.emoji.name === "6️⃣") {
            embed.setImage(attachmenturls[5])
          }
          if (reaction.emoji.name === "7️⃣") {
            embed.setImage(attachmenturls[6])
          }
          if (reaction.emoji.name === "8️⃣") {
            embed.setImage(attachmenturls[7])
          }
          if (reaction.emoji.name === "9️⃣") {
            embed.setImage(attachmenturls[8])
          }
          if (reaction.emoji.name === "🔟") {
            embed.setImage(attachmenturls[9])
          }
          embeds.splice(0, 1, embed)
          await reaction.message.edit({embeds})
        }
      }
    }
  },
}
