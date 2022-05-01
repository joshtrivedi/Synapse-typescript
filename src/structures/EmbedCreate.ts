const Discord = require('discord.js');

import { Client, GuildMember, Message, MessageEmbed, PartialGuildMember, TextChannel } from 'discord.js'

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

export const embedCreate = (titleFields: string[], fields: string[], fieldNames: string[]): MessageEmbed => {
    const embed = new MessageEmbed()
        .setColor(colorArray[getRandomInt(colorArray.length-1)] as `#${string}`)
        .setTitle(titleFields[0] ?? "BoxBot Embed")
        .setDescription(titleFields[1] ?? "Here is the data you requested")

    for (var i = 0; i < fields.length; i++) {
        //only allow 1024 characters per field
        embed.addField(fieldNames[i].toString(), fields[i].toString().length > 1024 ? fields[i].toString().substring(0, 1021)+"..." : fields[i].toString(), true) 
        //embed.addField(fieldNames[i]?.toString() ?? 'No Data', fields[i]?.toString() ?? 'No Data', true)
    }
    return embed
    
} 