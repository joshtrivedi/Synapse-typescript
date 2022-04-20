import { Command } from '../../structures/Command'
import Discord, { Message, MessageSelectMenu, Interaction, MessageButton, MessageEmbed, MessageActionRow, ButtonInteraction, MessageComponentInteraction } from 'discord.js'
import { isAuthorModerator } from '../../permissionsHandler'
import { embedCreate } from '../../structures/EmbedCreate'
import axios from "axios"
import { userInfo } from 'os'
const api = `https://mashape-community-urban-dictionary.p.rapidapi.com/define/`


export interface Root {
    list: List[]
}

export interface List {
    definition: string
    permalink: string
    thumbs_up: number
    sound_urls: string[]
    author: string
    word: string
    defid: number
    current_vote: string
    written_on: string
    example: string
    thumbs_down: number
}

export interface myData {
    word: string
    definition: string
    example: string
    permalink: string
}



export default new Command({
    name: "urban",
    description: "command to fetch TAF data for an id",
    options: [
        {
            name: "word",
            description: `Put in the word you want to know the meaning of`,
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
        },
    ],
    run: async ({ client, interaction }) => {
        const embeds: MessageEmbed[] = []
        const channel: Discord.TextChannel = interaction.channel as Discord.TextChannel
        const word = interaction.options.getString("word")
        const url = `http://api.urbandictionary.com/v0/define?term={${word}}`
        const response = await axios.get(url)
        const data = response.data
        const MappedData: Root = JSON.parse(JSON.stringify(data))
        MappedData.list.forEach(element => {
            var mydata: myData = {
                word: element.word,
                definition: element.definition.length < 1024 ? element.definition : element.definition.substring(0, 1021) + "...",
                example: element.example.length < 1024 ? element.example : element.example.substring(0, 1021) + "...",
                permalink: element.permalink
            }
            var fieldNames = Object.keys(mydata)
            var fieldValues = Object.values(mydata)
            var embed = embedCreate([`Urban Dictionary`, `Let's see what the word ${word} means`], fieldValues, fieldNames)

            embeds.push(embed)
        });
        const pages = {} as { [key: string]: number }

        const getRow = (id: string) => {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId("prev_embed")
                        .setStyle('SECONDARY')
                        .setEmoji('⬅')
                        .setDisabled(pages[id] === 0)
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId("next_embed")
                        .setStyle('SECONDARY')
                        .setEmoji('➡')
                        .setDisabled(pages[id] === embeds.length - 1)
                )
            return row
        }


        const id = interaction.user.id
        pages[id] = pages[id] || 0

        const embed = embeds[pages[id]]

        let reply: Message | undefined

        const filter = (btnInt: MessageComponentInteraction) => {
            return (btnInt.user.id === interaction.user.id)
        }

        interaction.followUp({
            embeds: [embed],
            components: [getRow(id)]
        })

        const collector = interaction.channel.createMessageComponentCollector({
            filter: filter,
            time: 1000 * 60 * 5
        })

        collector.on('collect', async (btnInt: ButtonInteraction) => {
            if (!btnInt) {return}
            if (btnInt.customId !== 'prev_embed' && btnInt.customId !== 'next_embed') {return}

            if (btnInt.customId === 'prev_embed' && pages[id] > 0) {
                --pages[id]
            } else if (btnInt.customId === 'next_embed' && pages[id] < embeds.length - 1) {
                ++pages[id]
            }
            interaction.editReply({
                embeds: [embeds[pages[id]]],
                components: [getRow(id)]
            })
        })
        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                interaction.editReply({
                    embeds: [embeds[pages[id]].setFooter("The interaction has expired")],
                })
            }
        })
    }
}) 
