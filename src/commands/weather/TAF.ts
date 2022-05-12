import { Command } from '../../structures/Command'
import Discord from 'discord.js'
import { embedCreate } from '../../structures/EmbedCreate'
import axios from "axios"
import { env } from 'process'

const link = "https://avwx.rest/api/taf/"
const token = env.apiToken;
const example: string[] = [" EGLL", "EHAM", "OMDB", "HAAB", "KLAX"]
const timezoneApi = "http://api.timezonedb.com/v2.1/get-time-zone?"


export interface Meta {
    timestamp: string
}

export interface Time {
    repr: string
    dt: string
}

export interface Root {
    meta: Meta
    raw: string
    station: string
    time: Time
    remarks: string
    forecast: Forecast[]
    start_time: StartTime2
    end_time: EndTime2
    max_temp: Number
    min_temp: Number
    alts: any
    temps: any
    units: Units
    info: info
    translations: translations
}

export interface translations {
    forecast: {
        altimeter: string
        clouds: string
        wx_codes: string
        visibility: string
        icing: string
        turbulence: string
        wind: string
        wind_shear: string
    }
    max_temp: string
    min_temp: string
    remarks: any[]
}

export interface Forecast {
    altimeter: string
    clouds: Cloud[]
    flight_rules: string
    other: any[]
    sanitized: string
    visibility: Visibility
    wind_direction: WindDirection
    wind_gust?: WindGust
    wind_speed: WindSpeed
    wx_codes: WxCode[]
    end_time: EndTime
    icing: any[]
    probability: any
    raw: string
    start_time: StartTime
    turbulence: any[]
    type: string
    wind_shear: any
    summary: string
}

export interface Cloud {
    repr: string
    type: string
    altitude: number
    modifier?: any
    direction?: any
}

export interface Visibility {
    repr: string
    value: any
    spoken: string
}

export interface WindDirection {
    repr: string
    value: number
    spoken: string
}

export interface WindGust {
    repr: string
    value: number
    spoken: string
}

export interface WindSpeed {
    repr: string
    value: number
    spoken: string
}

export interface WxCode {
    repr: string
    value: string
}

export interface EndTime {
    repr: string
    dt: string
}

export interface StartTime {
    repr: string
    dt: string
}

export interface StartTime2 {
    repr: string
    dt: string
}

export interface EndTime2 {
    repr: string
    dt: string
}

export interface Units {
    altimeter: string
    altitude: string
    temperature: string
    visibility: string
    wind_speed: string
}

export interface info {
    city: string,
    country: string,
    elevation_ft: number,
    elevation_m: number,
    iata: string,
    icao: string,
    latitude: number,
    longitude: number,
    name: string,
    note: any,
    reporting: string,
    runways: [[Object], [Object], [Object]],
    state: string,
    type: string,
    website: string,
    wiki: string
}

export interface MyData {
    Station: string,
    Name: string,
    Time: string,
    Date: string,
    Wind_direction: string,
    Wind_speed: string,
    Visibility: string,
    Cloud_type: string
    Cloud_altitude: string,
    Raw: string
}

export default new Command({
    name: "taf",
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
            const response = await axios.get(link + interaction.options.getString('id').toUpperCase() + `?options=info,translate`, { headers: { 'Authorization': `Bearer ${token}` } })

            if (response.status === 200) {
                const title = await response.data
                const MappedData: Root = JSON.parse(JSON.stringify(title))
                
                if (MappedData) {
                    const myData: MyData = {
                        Station: MappedData.station,
                        Name: MappedData.info.name,
                        Time: [MappedData.time.repr.slice(2, 4), ":", MappedData.time.repr.slice(4, 6)].join("") + " UTC",
                        Date: MappedData.time.dt.split("T")[0],
                        Wind_direction: MappedData.forecast[0] ? MappedData.forecast[0].wind_direction.repr : "No Forecast",
                        Wind_speed: MappedData.forecast[0] ? MappedData.forecast[0].wind_speed.repr + " " + MappedData.units.wind_speed : "No Forecast",
                        Visibility: MappedData.forecast[0] ? MappedData.forecast[0].visibility.repr + " " + MappedData.units.visibility : "No Forecast",
                        Cloud_type: MappedData.forecast[0].clouds[0]?.type.toUpperCase() ?? "No Cloud Forecast ",
                        Cloud_altitude: MappedData.forecast[0].clouds[0] ? MappedData.forecast[0].clouds[0]?.altitude + " " + MappedData.units.altitude : "No Cloud Forecast",
                        Raw: MappedData.raw
                    }
                    const id = interaction.options.getString('id').toUpperCase();
                    const titleFields = [`${interaction.command.name.toUpperCase()}`, `for ICAO Code ${id}`]
                    const fieldNames = Object.keys(myData)
                    const fields = Object.values(myData)
                    const embed = await embedCreate(titleFields, fields, fieldNames)
                    interaction.followUp({ embeds: [embed] })
                    return

                }
            }
            else if (response.status > 299) {
                interaction.followUp("Please make sure you entered the right ICAO code for example: `EHAM / eham`")
            }
        } catch(e) {
            console.log(e)
            interaction.followUp("Please make sure you entered the right ID for eg: `EHAM / eham`")
        }
    }
})

