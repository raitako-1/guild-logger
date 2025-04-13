import { Client } from 'discord.js'
import { type Logger } from './logger'
import dotenv from 'dotenv'
import { bool, cleanEnv, str, testOnly } from 'envalid'

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
  JSON_PATH: str({devDefault: './data.json'}),
  BOT_TOKEN: str(),
  BOT_LOG_CHANNEL_ID: str(),
  BOT_CLOSED_MESSAGE: str(),
  TARGET_GUILD_ID: str(),
  DAILY_CENSUS_SCRIPT: bool({default: true})
})
