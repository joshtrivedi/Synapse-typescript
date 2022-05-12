import Discord, { ButtonInteraction, DiscordAPIError, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command";
import { handler } from "vatsim-data-handler";
import { embedCreate } from "../../structures/EmbedCreate";
import progressbar from 'string-progressbar'
import axios from "axios";
import { env } from "process";
const token = env.apiToken;
const url = `http://vatsim-data.hardern.net/vatsim-data.txt`
const airportUrl = `https://avwx.rest/api/station/`
export interface Root {
    pilots: Pilot1[]
    controllers: Controller[]
}

interface Pilot1 {
    cid: number;
    name: string;
    callsign: string;
    server: string;
    pilot_rating: number;
    latitude: number;
    longitude: number;
    altitude: number;
    groundspeed: number;
    transponder: string;
    heading: number;
    qnh_i_hg: number;
    qnh_mb: number;
    flight_plan?: {
        flight_rules: string;
        aircraft: string;
        aircraft_faa: string;
        aircraft_short: string;
        departure: string;
        arrival: string;
        alternate: string;
        cruise_tas: string;
        altitude: string;
        deptime: string;
        enroute_time: string;
        fuel_time: string;
        remarks: string;
        route: string;
    };
    logon_time: string;
    last_updated: string;
}

export interface Pilot {
    cid: number
    realname: string
    callsign: string
    server: string
    pilotrating: number
    latitude: number
    longitude: number
    altitude: number
    groundspeed: number
    transponder: number
    heading: number
    QNH_iHg: number
    QNH_Mb: number
    flight_plan: FlightPlan
    logon_time: string
    last_updated: string
}

export interface Controller {
    cid: number
    name: string
    callsign: string
    frequency: string
    facility: number
    rating: number
    server: string
    visual_range: number
    text_atis: any
    last_updated: string
    logon_time: string
}

export interface FlightPlan {
    flight_rules: string
    aircraft: string
    aircraft_faa: string
    aircraft_short: string
    departure: string
    arrival: string
    alternate: string
    cruise_tas: string
    altitude: string
    deptime: string
    enroute_time: string
    fuel_time: string
    remarks: string
    route: string
    revision_id: number
    assigned_transponder: string
}

export interface myVatsimFlight {
    Callsign: string
    Aircraft: string
    Flight_rules: string
    Pilot_name: string
    CID: number
    Departure: string
    Arrival: string
    Alternate: string
    Route: string
    LogOn_Time: string
    Remarks: string
}

export interface myVatsimAirport {
    Airport: string
    Pilot: string
    Callsign: string
    LogOn_Time: string
    ATIS: string
}

export default new Command({
    name: "vatsim",
    description: "command to fetch latest activity for airport",
    options: [
        {
            name: "id",
            description: `Airport ICAO`,
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
        }
    ],
    run: async ({ client, interaction }) => {
        const embeds: MessageEmbed[] = []
        const title: string[] = []
        const airport = interaction.options.getString('id').toUpperCase()
        var airport_name: string
        try {
            const airportResponse = await axios.get(airportUrl + airport, { headers: { 'Authorization': `Bearer ${token}` } })
            if (airportResponse.status > 399) {
               return interaction.followUp("Please enter a valid ICAO code")
            }
            airport_name = airportResponse.data.name
            handler.getAirportInfo(airport).then(async (data: Root) => {
                //fetch airport api
                if (data.pilots.length === 0 && data.controllers.length === 0) {
                    return interaction.followUp("No data found for that ID")
                }
                //map the data to myVatsimAirport
                var MappedData: Root = JSON.parse(JSON.stringify(data))
                MappedData.pilots.forEach((element, i) => {
                    var myvatsimAirport: myVatsimAirport = {
                        Airport: airport_name ?? `${id}`,
                        Pilot: element.name ?? "N/A",
                        Callsign: element.callsign ?? "N/A",
                        LogOn_Time: element.logon_time ?? "N/A",
                        ATIS: `${MappedData.controllers[i]?.text_atis.join("\r\n")}` ?? `No Controllers found for ${id}`
                    }
                    const titleFields = Object.keys(myvatsimAirport)
                    const titleValues = Object.values(myvatsimAirport)
                    const title = [`Vatsim Data for`, `${airport_name}` ?? `${id}`]
                    const embed = embedCreate(title, titleValues, titleFields)
                    embeds.push(embed)
                });
                //create the embed
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
            })
        }
        catch (e) {
            console.log(e)
            return interaction.followUp("Please enter a valid ICAO code")
        }
    }
})