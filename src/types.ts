import {
  type ClientEvents,
  ButtonInteraction,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from 'discord.js'
import { type AppContext } from './util/config'

export interface EventModule {
  name: keyof ClientEvents
  once: boolean
  execute: (ctx: AppContext, ...args: any[]) => Promise<void>
}

export type InteractionModule = ButtonInteractionModule | CommandInteractionModule

export interface ButtonInteractionModule {
  type: 'button'
  customId: string
  execute: (ctx: AppContext, interaction: ButtonInteraction) => Promise<void>
}

export interface CommandInteractionModule {
  type: 'command'
  data: SlashCommandBuilder
  execute: (ctx: AppContext, interaction: ChatInputCommandInteraction) => Promise<void>
}
