import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from 'discord.js'
import { type AppContext } from '../../util/config'

export default {
  type: 'command',
  data: new SlashCommandBuilder()
    .setName('example')
    .setDescription('example application command'),
  execute: async (ctx: AppContext, interaction: ChatInputCommandInteraction): Promise<void> => {
    ctx.logger.info('example command')
    await interaction.reply({content: 'example command'})
  },
}
