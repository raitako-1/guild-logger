import { SlashCommandBuilder } from 'discord.js'
import { census } from '../../index'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('census')
		.setDescription('Runs census script.'),
	async execute(interaction: any) {
		await census()
      await interaction.reply('Done!')
	},
}
