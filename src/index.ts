import { ActivityType, ApplicationCommandPermissionsUpdateData, AutoModerationActionExecution, BaseInteraction, Client, Collection, ColorResolvable, EmbedBuilder, GatewayIntentBits, Guild, Message, MessageReaction, PartialMessageReaction, Partials, PartialUser, PermissionsBitField, REST, Routes, User, VoiceState } from 'discord.js'
declare module 'discord.js' {
  export interface Client {
    commands: Collection<unknown, any>
  }
}
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import cron from 'node-cron'

dotenv.config()
const checkDotenvBoolean = (val: string): boolean => {
  if (process.env[val] === 'true') {
    return true
	}
  return false
}
const checkDotenv = (val: string): string => {
  const dotenvVal: string | undefined = process.env[val]
  if (!dotenvVal) {
    const err: Error = new Error(val + ' is not set to .env!')
		err.name = 'SettingsError'
    throw err
	}
  return dotenvVal
}
const log = (type: string, message: string): void => {
  const date: Date = new Date(Date.now())
  const dateString: string = date.toISOString().replace('T',' ').slice(0,19)
  const prefixString: string = `[${dateString} ${type}]: `
  const messageArray: string[] = []
  message.split('\n').forEach((element, index) => {
    if (index === 0) {
      messageArray.push(element)
    } else {
      messageArray.push(`${' '.repeat(prefixString.length)}${element}`)
    }
  })
  const messageString: string = messageArray.join('\n')
  if (type === 'DEBUG') {
    if (debugMode) {
      console.log(`${prefixString}${messageString}`)
    }
  } else if (type === 'ERROR') {
    console.error(`${prefixString}${messageString}`)
  } else {
    console.log(`${prefixString}${messageString}`)
  }
}
const myIntents: any[] = Array.from(new Set(Object.values(GatewayIntentBits).filter(Number.isInteger)))
const myPartials: any[] = Array.from(new Set(Object.values(Partials).filter(Number.isInteger)))
const client: Client = new Client({intents: myIntents, partials: myPartials})
client.commands = new Collection()
const projectName: string = 'Guild Logger'
const creditVersion: string = 'Ver.2.3.4'
let logChannel: any
let targetGuild: any
const debugMode: boolean = checkDotenvBoolean('DEBUG_MODE')
const dailyCensusScript: boolean = checkDotenvBoolean('DAILY_CENSUS_SCRIPT')


console.log(`Starting ${projectName} ${creditVersion}`)
console.log('System Info: Node.js ' + process.version + ' Host: ' + process.platform)
console.log('Loading source, please wait...')
if (debugMode) {log('INFO', 'debugMode is enabled.')}
if (dailyCensusScript) {log('INFO', 'dailyCensusScript is enabled.')}

client.once('ready', async () => {
  if (client.user) {
    log('INFO', `Logged in as ${client.user.tag}!`)

    const commands = []
    const foldersPath = path.join(__dirname, 'commands')
    const commandFolders = fs.readdirSync(foldersPath)
    for (const folder of commandFolders) {
      const commandsPath = path.join(foldersPath, folder)
      const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'))
      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file)
        const command = require(filePath)
		    if ('data' in command && 'execute' in command) {
          client.commands.set(command.data.name, command)
			    commands.push(command.data.toJSON())
		    } else {
			    log('WARN', `The command at ${filePath} is missing a required "data" or "execute" property.`)
		    }
	    }
    }
    log('INFO', `Started refreshing ${commands.length} application (/) commands.`)
    const rest = new REST().setToken(checkDotenv('TOKEN'))
    try {
      const data: any = await rest.put(
        Routes.applicationCommands(client.user.id),
        {body: commands},
      )
      log('INFO', `Successfully reloaded ${data.length} application (/) commands.`)
    } catch (error) {
      const err: Error = new Error('Failed to reload application (/) commands.')
	  	err.name = 'applicationCommandsError'
      throw err
    }

    logChannel = await client.channels.fetch(checkDotenv('LOG_CHANNEL_ID'))
    if (logChannel?.type === 0) {
      await logChannel.send(`Started ***${projectName}** __${creditVersion}__*\nPlease check /help.`)
      log('INFO', 'logChannel is OK!')
    } else {
      const err: Error = new Error('The logChannel you specified is not TextChannel Class!')
		  err.name = 'SettingsError'
      throw err
    }

    /*process.on('exit', () => {
      botChannel.send(`***${projectName}*** has stopped.`)
      console.log(`Stopping ${projectName}...`)
    })
    process.on('SIGINT', async () => {
      await botChannel.send(`***${projectName}*** has stopped.`)
      process.exit(0)
    })
    process.on("SIGHUP", () => {
      process.exit(255)
    })*/

    await census()
    if (dailyCensusScript) {
      log('INFO', 'Started setting CensusScript to crontab.')
      cron.schedule('0 0 0 * * *', () => census())
      log('INFO', 'Successfully setted CensusScript to crontab.')
    }
  } else {
    const err: Error = new Error('Could not login successfully!')
		err.name = 'SettingsError'
    throw err
  }
  log('INFO', 'CheckScript is done!')
})

client.on('messageCreate', async (message: Message) => {
  log('DEBUG', 'messageCreate')
  if (debugMode) {console.log(message)}
  if (message.author.id === client.user?.id && message.channel === logChannel) {
    return
  }
  if (message.guild === targetGuild) {
    if (message.channel.type === 0 || message.channel.type === 2) {
      if (message.member) {
        const data = JSON.parse(fs.readFileSync('./src/data.json', 'utf8'))
        if (message.author.bot) {
          var isbot: string = " [BOT]"
        } else {
          var isbot: string = ""
        }
        if (message.system) {
          var issystem: string = " [System]"
        } else {
          var issystem: string = ""
        }
        const embed = new EmbedBuilder()
          .setTitle('messageCreate' + issystem)
          .setColor(message.member.displayHexColor)
          .setURL('https://discord.com/channels/' + message.guildId + '/' + message.channelId + '/' + message.id)
          .setAuthor({
            name: message.member.displayName + "\n" + message.author.tag + isbot,
            url: 'https://discord.com/users/' + message.author.id,
            iconURL: message.member.displayAvatarURL()
          })
          .setFooter({
            text: message.createdAt.toString(),
            iconURL: "https://www.raitako.com/img/raitako_icon.jpg"
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
          embed.setDescription("This message was pinned.")
        }
        if (message.channel.type === 0) {
          embed.addFields({name: "channel", value: "#" + message.channel.name})
        } else if (message.channel.type === 2) {
          embed.addFields({name: "channel", value: "<" + message.channel.name})
        }
        if (message.channel.parent?.name) {
          embed.addFields({name: "category", value: message.channel.parent.name})
        }
        var embeds: any = [embed]
        for (const messageEmbed of message.embeds) {
          embeds.push(messageEmbed)
        }
        if (message.reference?.messageId) {
          try {
            const reference_message = await logChannel.messages.fetch(data.rm[message.reference.messageId])
            var msg = await reference_message.reply({embeds: embeds})
          } catch {
            var msg = await logChannel.send({content: "リプライ先が読み込めませんでした...", embeds: embeds})
          }
        } else{
          var msg = await logChannel.send({embeds: embeds})
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
        fs.writeFileSync('./src/data.json', json)
      }
    }
  }
  if (message.content === "/gl census") {
    census()
  }
})

client.on('messageReactionAdd', async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
  log('DEBUG', 'messageReactionAdd')
  if (debugMode) {
    console.log(reaction)
    console.log(user)
  }
  const data = JSON.parse(fs.readFileSync('./src/data.json', 'utf8'))
  if (user !== client.user) {
    if (reaction.message.id in data.mr) {
      reaction.users.remove(user.id)
      const motoChannel = await client.channels.fetch(data.mr[reaction.message.id].channelId)
      if (motoChannel?.type === 0) {
        const reactionMessage = await logChannel.messages.fetch(reaction.message.id)
        const message = await motoChannel.messages.fetch(data.mr[reaction.message.id].id)
        const embed = EmbedBuilder.from(reactionMessage.embeds[0])
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
        reactionMessage.embeds[0] = embed
        await reaction.message.edit({embeds: reactionMessage.embeds})
      }
    }
  }
})

client.on('voiceStateUpdate', async (oldState: VoiceState, newState: VoiceState) => {
  log('DEBUG', 'voiceStateUpdate')
  if (debugMode) {
    console.log(oldState)
    console.log(newState)
  }
  if (newState.guild === targetGuild && oldState.guild === targetGuild && newState.member) {
    if (newState.member.user.bot) {
      var isbot = " [BOT]"
    } else {
      var isbot = ""
    }
    const embed = new EmbedBuilder()
      .setTitle('voiceStateUpdate')
      .setColor(newState.member.displayHexColor)
      .setAuthor({
        name: newState.member.displayName + "\n" + newState.member.user.tag + isbot,
        url: 'https://discord.com/users/' + newState.member.id,
        iconURL: newState.member.displayAvatarURL()
      })
      .setFooter({
        text: new Date().toString(),
        iconURL: "https://www.raitako.com/img/raitako_icon.jpg"
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
})

client.on('applicationCommandPermissionsUpdate', async (data: ApplicationCommandPermissionsUpdateData) => {
  log('DEBUG', 'applicationCommandPermissionsUpdate')
  if (debugMode) {console.log(data)}
  if (data.guildId === targetGuild.id) {
    const application = await targetGuild.members.fetch(data.applicationId)
    if (application.user.bot) {
      var isbot = " [BOT]"
    } else {
      var isbot = ""
    }
    const embed = new EmbedBuilder()
      .setColor(application.displayHexColor)
      .setTitle('applicationCommandPermissionsUpdate')
      .setURL('https://discord.com/channels/' + data.guildId)
      .setAuthor({
        name: application.displayName + "\n" + application.user.tag + isbot,
        url: 'https://discord.com/users/' + data.applicationId,
        iconURL: application.displayAvatarURL()
      })
      .setDescription('```json\npermissions: ' + JSON.stringify(data.permissions, null, 4) + '\n```')
      .setFooter({
        text: new Date().toString(),
        iconURL: "https://www.raitako.com/img/raitako_icon.jpg"
      })
      /*if message.author.display_icon != None:
          embed.set_thumbnail(url=message.author.display_icon.url)*/
    await logChannel.send({embeds: [embed]})
  }
})

client.on('autoModerationActionExecution', async (autoModerationActionExecution: AutoModerationActionExecution) => {
  log('DEBUG', 'autoModerationActionExecution')
  if (debugMode) {console.log(autoModerationActionExecution)}
  if (autoModerationActionExecution.guild === targetGuild) {
    if (autoModerationActionExecution.user && autoModerationActionExecution.member) {
      if (autoModerationActionExecution.user.bot) {
        var isbot = " [BOT]"
      } else {
        var isbot = ""
      }
      const embed = new EmbedBuilder()
        .setColor(autoModerationActionExecution.member.displayHexColor)
        .setTitle('autoModerationActionExecution')
        .setURL('https://discord.com/channels/' + autoModerationActionExecution.guild.id + '/' + autoModerationActionExecution.channelId + '/' + autoModerationActionExecution.alertSystemMessageId)
        .setAuthor({
          name: autoModerationActionExecution.member.displayName + "\n" + autoModerationActionExecution.user.tag + isbot,
          url: 'https://discord.com/users/' + autoModerationActionExecution.userId,
          iconURL: autoModerationActionExecution.member.displayAvatarURL()
        })
        .setDescription('```json\n' + JSON.stringify(autoModerationActionExecution, null, 4) + '\n```')
        .addFields({name: "channel", value: "#" + autoModerationActionExecution.channel?.name})
        .setFooter({
          text: new Date().toString(),
          iconURL: "https://www.raitako.com/img/raitako_icon.jpg"
        })
        /*if message.author.display_icon != None:
            embed.set_thumbnail(url=message.author.display_icon.url)*/
      if (autoModerationActionExecution.channel?.parent?.name) {
        embed.addFields({name: "category", value: autoModerationActionExecution.channel.parent.name})
      }
      await logChannel.send({embeds: [embed]})
    }
  }
})

client.on('autoModerationRuleCreate', async (autoModerationRule) => {
  console.log(autoModerationRule)
})

client.on('autoModerationRuleDelete', async (autoModerationRule) => {
  console.log(autoModerationRule)
})

client.on('autoModerationRuleUpdate', async (oldAutoModerationRule, newAutoModerationRule) => {
  console.log(oldAutoModerationRule)
  console.log(newAutoModerationRule)
})

client.on('cacheSweep', async (message) => {
  log('DEBUG', `[CacheSweep] ${message}`)
})

client.on('channelCreate', async (channel) => {
  console.log(channel)
})

client.on('channelDelete', async (channel) => {
  console.log(channel)
})

client.on('channelPinsUpdate', async (channel, time) => {
  console.log(channel)
  console.log(time)
})

client.on('channelUpdate', async (oldChannel, newChannel) => {
  console.log(oldChannel)
  console.log(newChannel)
})

client.on('debug', (info: string) => {
  log('DEBUG', info)
})

client.on('error', (error: Error) => {
  log('ERROR', error.message)
})

client.on('guildAuditLogEntryCreate', async (auditLogEntry, guild) => {
  console.log(auditLogEntry)
  console.log(guild)
})

client.on('guildAvailable', async (guild) => {
  console.log(guild)
})

client.on('guildBanAdd', async (ban) => {
  console.log(ban)
})

client.on('guildBanRemove', async (ban) => {
  console.log(ban)
})

client.on('guildCreate', async (guild) => {
  console.log(guild)
})

client.on('guildDelete', async (guild) => {
  console.log(guild)
})

client.on('emojiCreate', async (emoji) => {
  console.log(emoji)
})

client.on('emojiDelete', async (emoji) => {
  console.log(emoji)
})

client.on('emojiUpdate', async (oldEmoji, newEmoji) => {
  console.log(oldEmoji)
  console.log(newEmoji)
})

client.on('interactionCreate', async (interaction: BaseInteraction) => {
  log('DEBUG', 'interactionCreate')
  if (debugMode) {console.log(interaction)}

	if (!interaction.isChatInputCommand()) return
	const command = interaction.client.commands.get(interaction.commandName)

	if (!command) {
		log('ERROR', `No command matching ${interaction.commandName} was found.`)
		return
	}

	try {
		await command.execute(interaction)
	} catch (error) {
    if (error instanceof Error) {
      log('ERROR', error.message)
    }
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
		}
	}
})

export const census = async () => {
  log('INFO', 'Starting census script...')
  await logChannel.send('Starting census script...')

  let joinnedGuilds: string = 'top of client.guilds\n\n'
	for (const joinnedGuildId of client.guilds.cache.map(guild => guild.id)) {
		const joinnedGuild: Guild = await client.guilds.fetch(joinnedGuildId)
		if (typeof joinnedGuild !== 'undefined') {
			joinnedGuilds = joinnedGuilds + joinnedGuild.name
			if (joinnedGuild.id === process.env.TARGET_GUILD_ID) joinnedGuilds = joinnedGuilds + " <- targeted"
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
  targetGuild = await client.guilds.fetch(process.env.TARGET_GUILD_ID ?? '')
	if (!targetGuild) {
    if (process.env.TARGET_GUILD_ID) {
      console.log('[WARN]: Cannot read the TargetGuild you specified!')
		  await logChannel.send('Warn: **Cannot read the TargetGuild you specified!**')
      return
    } else {
      console.log('[ERROR]: TARGET_GUILD_ID is not set to .env!')
		  await logChannel.send('Error [SettingsError]: **Set TARGET_GUILD_ID to .env!**')
      return
    }
	}
  log('INFO', 'targetGuild is OK!')
  await logChannel.send('targetGuild is OK!')

  const TGChannels = await targetGuild.channels.fetch()
  let channelsString: string = "top of channels of targetGuild\n\n"
  for (const TGChannel of TGChannels) {
    if (!TGChannel[1].parent) {
      if (TGChannel[1].type === 0) {
        channelsString = channelsString + "#" + TGChannel[1].name + "\n"
      }
      if (TGChannel[1].type === 2) {
        channelsString = channelsString + "<" + TGChannel[1].name + "\n"
      }
    }
  }
  channelsString = channelsString + "\n"
  for (const TGChannel of TGChannels) {
    if (TGChannel[1].type === 4) {
      channelsString = channelsString + TGChannel[1].name + "\n"
      for (const TGCChildren of TGChannel[1].children.cache) {
        if (TGCChildren[1].type === 0) {
          channelsString = channelsString + "> #" + TGCChildren[1].name + "\n"
        }
        if (TGCChildren[1].type === 2) {
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
  log('INFO', 'census script => done!')
}

log('INFO', 'Source was loaded! Attempt to log in...')

client.login(checkDotenv('TOKEN'))
