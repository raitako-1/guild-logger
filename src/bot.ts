import {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js'
declare module 'discord.js' {
  export interface Client {
    interactions: {
      buttons: Collection<string, ButtonInteractionModule>
      commands: Collection<string, CommandInteractionModule>
    }
  }
}
import fs from 'fs'
import path from 'path'
import { type ButtonInteractionModule, type CommandInteractionModule, type EventModule, type InteractionModule } from './types'
import { type AppContext, env } from './util/config'
import { createLogger, type Logger } from './util/logger'

export class Bot {
  public client: Client
  public ctx: AppContext

  constructor(
    client: Client,
    ctx: AppContext
  ) {
    this.client = client
    this.ctx = ctx
  }

  static async create() {
    const logger = createLogger(['Runner', 'Bot'])
    logger.info(`Creating bot...`)

    const myIntents: any[] = Array.from(new Set(Object.values(GatewayIntentBits).filter(Number.isInteger)))
    const myPartials: any[] = Array.from(new Set(Object.values(Partials).filter(Number.isInteger)))
    const client = new Client({intents: myIntents, partials: myPartials})
    const rest = new REST().setToken(env.BOT_TOKEN)

    const ctx: AppContext = {
      logger,
      client,
    }

    logger.info('Loading events, please wait...')
    const eventsPath = path.join(__dirname, 'events')
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(path.parse(__filename).ext))
    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file)
      const event = (await import(filePath)).default as EventModule
      const eventCtx: AppContext = {
        ...ctx,
        logger: createLogger(['Runner', 'Bot', `evt: ${event.name}`]),
      }
      if (event.once) {
        logger.debug(`Set event (once): ${event.name} at ${filePath}`)
        client.once(event.name, async (...args: any[]): Promise<void> => await event.execute(eventCtx, ...args))
      } else {
        logger.debug(`Set event (on): ${event.name} at ${filePath}`)
        client.on(event.name, async (...args: any[]): Promise<void> => await event.execute(eventCtx, ...args))
      }
    }
    logger.debug(`Successfully loaded ${eventFiles.length} events.`)

    logger.info('Loading interactions, please wait...')
    client.interactions = {
      buttons: new Collection(),
      commands: new Collection(),
    }
    const foldersPath = path.join(__dirname, 'interactions')
    const {buttons, commands} = await loadAllInteractionModules(foldersPath, logger, client, rest)
    logger.debug(`Successfully loaded:\n ${buttons.length} buttons,\n ${commands.length} application (/) commands,`)
    logger.debug(`Started refreshing ${commands.length} application (/) commands.`)
    try {
      const data: any = await rest.put(
        Routes.applicationCommands(Buffer.from(env.BOT_TOKEN.split(".")[0], 'base64').toString()),
        {body: commands},
      )
      logger.debug(`Successfully reloaded ${data.length} application (/) commands.`)
    } catch (error) {
      const err: Error = new Error('Failed to reload application (/) commands.')
      err.name = 'applicationCommandsError'
      throw err
    }

    logger.debug('Source was loaded!')

    logger.debug('Bot has been created!')

    return new Bot(client, ctx)
  }

  async start() {
    this.ctx.logger.info(`Starting bot...`)
    if (!fs.existsSync(path.resolve(env.JSON_PATH))) {
      this.ctx.logger.info(`Initializing ${env.JSON_PATH} ...`)
      fs.writeFileSync(path.resolve(env.JSON_PATH), JSON.stringify({rm: {}, mr:{}}, null, 2))
      this.ctx.logger.debug(`Initialized ${path.resolve(env.JSON_PATH)}`)
    }
    await this.client.login(env.BOT_TOKEN)
    this.ctx.logger.info('Bot started')
  }

  async stop() {
    this.ctx.logger.info('Stopping bot...')
    const logChannel = await this.client.channels.fetch(env.BOT_LOG_CHANNEL_ID)
    if (logChannel?.type === 0) await logChannel.send(env.BOT_CLOSED_MESSAGE)
    await this.client.destroy()
    this.ctx.logger.info('Bot stopped')
  }
}

const loadAllInteractionModules = async (
  foldersPath: string,
  logger: Logger,
  client: Client,
  rest: REST,
  buttons: string[] = [],
  commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [],
): Promise<{
  buttons: string[],
  commands: RESTPostAPIChatInputApplicationCommandsJSONBody[],
}> => {
  const interactionFiles = fs.readdirSync(foldersPath)
  for (const file of interactionFiles) {
    const interactionPath = path.join(foldersPath, file)
    if (fs.statSync(interactionPath).isDirectory()) await loadAllInteractionModules(interactionPath, logger, client, rest, buttons, commands)
    else if (interactionPath.endsWith(path.parse(__filename).ext)) {
      const interactionModule = (await import(interactionPath)).default as InteractionModule
      if (interactionModule.type === 'button') {
        logger.debug(`Set button: ${interactionModule.customId} at ${interactionPath}`)
        client.interactions.buttons.set(interactionModule.customId, interactionModule)
        buttons.push(interactionModule.customId)
      } else if (interactionModule.type === 'command') {
        logger.debug(`Set command: ${interactionModule.data.name} at ${interactionPath}`)
        client.interactions.commands.set(interactionModule.data.name, interactionModule)
        commands.push(interactionModule.data.toJSON())
      }
    }
  }
  return {buttons, commands}
}
