import { Client } from 'discord.js'
import dotenv from 'dotenv'
import { cleanEnv, str, testOnly } from 'envalid'
import { type Logger } from './logger'

export interface AppContext {
  logger: Logger
  client: Client
}

dotenv.config()

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly('test'),
    choices: ['test', 'production'],
  }),
  BOT_TOKEN: str(),
  BOT_LOG_CHANNEL_ID: str(),
  BOT_ONREADY_MESSAGE: str(),
  BOT_CLOSED_MESSAGE: str()
})
