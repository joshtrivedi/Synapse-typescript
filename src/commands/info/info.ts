import { Command } from '../../structures/Command'
import Discord from 'discord.js'
import { embedCreate } from '../../structures/EmbedCreate'
import axios from "axios"
import { env } from 'process'

const flagEmojis = require('../../utils/flagEmojis')
const link = "https://avwx.rest/api/station/"
const token = env.apiToken;
const example: string[] = [" EGLL", "EHAM", "OMDB", "HAAB", "KLAX"]
const timezoneApi = "http://api.timezonedb.com/v2.1/get-time-zone?"

function getEmojifromCode(args: string) {
    const matching = flagEmojis.find(element => element.code === args)
    return matching.emoji
}

export interface Root {
    city: string
    country: string
    elevation_ft: number
    elevation_m: number
    iata: string
    icao: string
    latitude: number
    longitude: number
    name: string
    note: string
    reporting: boolean
    runways: Runway[]
    state: string
    type: string
    website: string
    wiki: string
}

export interface Runway {
    length_ft: number
    width_ft: number
    ident1: string
    ident2: string
}

export interface MyData {
    // Name: string
    // City: string
    // Country: string
    Type: string
    Elevation: string
    Iata: string
    Icao: string
    Latitude: number
    Longitude: number
    Runways: number
    Website: string
    Wiki: string
}

export default new Command({
    name: "info",
    description: "command to fetch TAF data for an id",
    options: [
        {
            name: "id",
            description: `Put in the ID for Taf`,
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
        }
    ],
    run: async ({ client, interaction }) => {

        try {
            const response = await axios.get(link + interaction.options.getString('id').toUpperCase(), { headers: { 'Authorization': `Bearer ${token}` } })

            if (response.status === 200) {
                console.log(response.data)
                var MappedData: Root = JSON.parse(JSON.stringify(response.data))

                if (MappedData) {

                    const myData: MyData = {
                        // Name: MappedData.name,
                        // City: MappedData.city,
                        // Country: MappedData.country,
                        Type: MappedData.type.split("_").map((word) => {
                            return word[0].toUpperCase() + word.substring(1);
                        }).join(" "),
                        Elevation: MappedData.elevation_ft + " ft" + " / " + MappedData.elevation_m + " m",
                        Iata: MappedData.iata,
                        Icao: MappedData.icao,
                        Latitude: MappedData.latitude,
                        Longitude: MappedData.longitude,
                        Runways: MappedData.runways.length,
                        Website: `[here](${MappedData.website})`,
                        Wiki: `[here](${MappedData.wiki})`
                    }

                    const id = interaction.options.getString('id').toUpperCase()
                    const titleFields = [`${MappedData.city}, ${MappedData.country}    ${getEmojifromCode(MappedData.country)}`, `${MappedData.name}`]
                    const fieldNames = Object.keys(myData)
                    const fieldValues = Object.values(myData)
                    const embed = await embedCreate(titleFields, fieldValues, fieldNames)
                    interaction.followUp({ embeds: [embed] })
                }
            }
        } catch (e) {
            console.log(e)
            interaction.followUp("Please make sure you entered the right ID for eg: `EHAM / eham`")
        }
    }
})