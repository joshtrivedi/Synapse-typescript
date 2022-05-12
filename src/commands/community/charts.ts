import { Response } from "node-fetch";
import { Command } from "../../structures/Command";
import axios from "axios";
import Discord, { ButtonInteraction, DiscordAPIError, Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from "discord.js";
import { embedCreate } from "../../structures/EmbedCreate";
import { Url } from "url";


export interface Root {
    icao: ICAO[]
}

export interface ICAO {
    state: string
    state_full: string
    city: string
    volume: string
    airport_name: string
    military: string
    faa_ident: string
    icao_ident: string
    chart_seq: string
    chart_code: string
    chart_name: string
    pdf_name: string
    pdf_path: string
}

interface Mdata {
    State: string
    City: string
    Airport: string
    Military: string
    FAA: string
    ICAO: string
    Chart_Seq: string
    Chart_Code: string
    Chart_Name: string
    PDF_Name: string
    PDF_Path: Url
}


export default new Command({
    name: "charts",
    description: "returns a chart of the airport",
    options: [
        {
            name: "airport",
            description: "airport to get chart for",
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
        },
    ],
    run: async ({ client, interaction }) => {
        const embeds: MessageEmbed[] = []
        var icao = interaction.options.getString("airport").toUpperCase()
        const url = `https://api.aviationapi.com/v1/charts?apt=${icao}`

        //fetch data as json header
        try {
            const response = await axios.get(url, { headers: { 'Content-Type': 'application/json' } })
            if (response.status === 200) {
                var data = response.data
                var MappedData: Root = JSON.parse(JSON.stringify(data))
                var DynamicMappedData = MappedData[`${icao}`]
                if (DynamicMappedData.length === 0) {
                    interaction.followUp(`No chart for ${interaction.options.getString('airport').toUpperCase()}`)
                    return
                }

                DynamicMappedData.forEach(element => {
                    var mydata: Mdata = {
                        State: element.state,
                        City: element.city,
                        Airport: element.airport_name,
                        Military: element.military,
                        FAA: element.faa_ident,
                        ICAO: element.icao_ident,
                        Chart_Seq: element.chart_seq,
                        Chart_Code: element.chart_code,
                        Chart_Name: element.chart_name,
                        PDF_Name: element.pdf_name,
                        PDF_Path: element.pdf_path
                    }
                    var fieldNames = Object.keys(mydata)
                    var fieldValues = Object.values(mydata)
                    var embed = embedCreate([`CHARTS`, `Charts for ${interaction.options.getString('airport').toUpperCase()} means`], fieldValues, fieldNames)

                    embeds.push(embed)
                })

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
                    if (!btnInt) { return }
                    if (btnInt.customId !== 'prev_embed' && btnInt.customId !== 'next_embed') { return }

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
        } catch (error) {
            interaction.channel.send(`No charts found for ${interaction.options.getString('airport').toUpperCase()}`)
        }
    }
})