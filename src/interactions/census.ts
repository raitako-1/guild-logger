import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Events,
} from 'discord.js'
import { census } from '../util/census'
import { type AppContext } from '../util/config'
import { createLogger } from '../util/logger'

export default {
  type: 'command',
  data: new SlashCommandBuilder()
    .setName('census')
    .setDescription('Runs census script.'),
  execute: async (ctx: AppContext, interaction: ChatInputCommandInteraction): Promise<void> => {
    ctx.logger.info('Runs census script.')
    const censusCtx: AppContext = {
      ...ctx,
      logger: createLogger({name: 'BOT', childs: [`evt: ${Events.InteractionCreate}`, `cmd: /${interaction.commandName}`, 'script: census']}),
    }
    await census(censusCtx)
    await interaction.reply('Done!')
  },
}
