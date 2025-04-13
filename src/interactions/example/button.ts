import { ButtonInteraction } from 'discord.js'
import { type AppContext } from '../../util/config'

export default {
  type: 'button',
  customId: 'example',
  execute: async (ctx: AppContext, interaction: ButtonInteraction): Promise<void> => {
    ctx.logger.info('example button')
    await interaction.reply({content: 'example button'})
  },
}
