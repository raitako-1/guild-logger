import { Events, BaseInteraction } from 'discord.js'
import { type AppContext } from '../util/config'
import { createLogger } from '../util/logger'

export default {
  name: Events.InteractionCreate,
  once: false,
  execute: async (ctx: AppContext, interaction: BaseInteraction): Promise<void> => {
    if (interaction.isButton()) {
      const button = interaction.client.interactions.buttons.get(interaction.customId)

      if (!button) {
        ctx.logger.error(`No button matching ${interaction.customId} was found.`)
        return
      }

      const buttonCtx: AppContext = {
        ...ctx,
        logger: createLogger(['Runner', 'Bot', `evt: ${Events.InteractionCreate}`, `button: ${interaction.customId}`]),
        client: interaction.client,
      }

      try {
        await button.execute(buttonCtx, interaction)
      } catch (error) {
        if (error instanceof Error) {
          buttonCtx.logger.error(error.message)
        }
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: 'There was an error while executing this button!', ephemeral: true })
        } else {
          await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true })
        }
      }
    } else if (interaction.isChatInputCommand()) {
      const command = interaction.client.interactions.commands.get(interaction.commandName)

      if (!command) {
        ctx.logger.error(`No command matching ${interaction.commandName} was found.`)
        return
      }

      const commandCtx: AppContext = {
        ...ctx,
        logger: createLogger(['Runner', 'Bot', `evt: ${Events.InteractionCreate}`, `cmd: /${interaction.commandName}`]),
        client: interaction.client,
      }

      try {
        await command.execute(commandCtx, interaction)
      } catch (error) {
        if (error instanceof Error) {
          commandCtx.logger.error(error.message)
        }
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })
        } else {
          await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
        }
      }
    } else if (interaction.isStringSelectMenu()) {
      // respond to the select menu
    }
  },
}
