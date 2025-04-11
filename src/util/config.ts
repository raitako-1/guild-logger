import { type Logger } from './logger'
import dotenv from 'dotenv'
import { cleanEnv, str, testOnly } from 'envalid'

export interface AppContext {
  logger: Logger
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
