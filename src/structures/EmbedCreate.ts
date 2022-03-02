const Discord = require('discord.js');

import { Client, GuildMember, Message, MessageEmbed, PartialGuildMember, TextChannel } from 'discord.js'

export const embedCreate = (args : String[]): MessageEmbed => {

    const embed = new MessageEmbed()
    .setColor(args[0] as `#${string}`)
    .setTitle(args[1] as `${string}`)
    .setDescription(args[2] as `${string}`)
    .setTimestamp()

    return embed
} 