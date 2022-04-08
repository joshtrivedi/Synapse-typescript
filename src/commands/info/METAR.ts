import { Command } from '../../structures/Command'
import Discord from 'discord.js'
import { embedCreate } from '../../structures/EmbedCreate'
import axios from "axios"
import { env } from 'process'
const link = "https://avwx.rest/api/metar/"
const token = env.apiToken;


export interface Root {
    meta: Meta
    altimeter: Altimeter
    clouds: Cloud[]
    flight_rules: string
    other: any[]
    sanitized: string
    visibility: Visibility
    wind_direction: WindDirection
    wind_gust: any
    wind_speed: WindSpeed
    wx_codes: WxCode[]
    raw: string
    station: string
    time: Time
    remarks: string
    dewpoint: Dewpoint
    relative_humidity: number
    remarks_info: RemarksInfo
    runway_visibility: any[]
    temperature: Temperature
    wind_variable_direction: any[]
    density_altitude: number
    pressure_altitude: number
    units: Units
    translate: Translate
    info: Info
}

export interface Meta {
    timestamp: string
}

export interface Altimeter {
    repr: string
    value: number
    spoken: string
}

export interface Cloud {
    repr: string
    type: string
    altitude: number
    modifier: any
    direction: any
}

export interface Visibility {
    repr: string
    value: number
    spoken: string
}

export interface WindDirection {
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

export interface Time {
    repr: string
    dt: string
}

export interface Dewpoint {
    repr: string
    value: number
    spoken: string
}

export interface RemarksInfo {
    maximum_temperature_6: MaximumTemperature6
    minimum_temperature_6: MinimumTemperature6
    pressure_tendency: PressureTendency
    precip_36_hours: any
    precip_24_hours: any
    sunshine_minutes: any
    codes: Code[]
    dewpoint_decimal: DewpointDecimal
    maximum_temperature_24: any
    minimum_temperature_24: any
    precip_hourly: any
    sea_level_pressure: SeaLevelPressure
    snow_depth: any
    temperature_decimal: TemperatureDecimal
}

export interface MaximumTemperature6 {
    repr: string
    value: number
    spoken: string
}

export interface MinimumTemperature6 {
    repr: string
    value: number
    spoken: string
}

export interface PressureTendency {
    repr: string
    tendency: string
    change: number
}

export interface Code {
    repr: string
    value: string
}

export interface DewpointDecimal {
    repr: string
    value: number
    spoken: string
}

export interface SeaLevelPressure {
    repr: string
    value: number
    spoken: string
}

export interface TemperatureDecimal {
    repr: string
    value: number
    spoken: string
}

export interface Temperature {
    repr: string
    value: number
    spoken: string
}

export interface Translate {
    altimeter: string
    clouds: string
    wx_codes: string
    visibility: string
    dewpoint: string
    remarks: Remarks
    temperature: string
    wind: string
}

export interface Remarks {
    maxtemp: string
    mintemp: string
    presdiff: string
    AO2: string
    slp: string
    tandd: string
}


export interface Units {
    accumulation: string,
    altimeter: string,
    altitude: string,
    temperature: string,
    visibility: string,
    wind_speed: string
}

export interface Info {
    city: string
    country: string
    elevation_ft: number
    elevation_m: number
    iata: string
    icao: string
    latitude: number
    longitude: number
    name: string
    note: any
    reporting: boolean
    runways: Runway[]
    state: string
    type: string
    website: any
    wiki: string
}
export interface Runway {
    length_ft: number
    width_ft: number
    surface: string
    lights: boolean
    ident1: string
    ident2: string
    bearing1: number
    bearing2: number
}
export interface MyData {
    type: string
    Station: string
    Name: string
    Date: string
    Time: string
    Wind: string
    Visibility: string
    Weather: string
    SkyCondition: string
    Temperature: string
    DewPoint: string
    Altimeter: string
    Raw: string
}


export default new Command({
    name: "metar",
    description: "fetch metar data",
    options: [{
        name: "id",
        description: "airport ICAO code",
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
    }],
    run: async ({ client, interaction }) => {

        try {
            const response = await axios.get(link + interaction.options.getString('id').toUpperCase() + `?options=info,translate`, { headers: { 'Authorization': `Bearer ${token}` } })

            if (response.status === 200) {
                //console.log(response.data)
                var allData: Root = JSON.parse(JSON.stringify(response.data))
                console.log(allData)
                var data: MyData = {
                    type: "METAR",
                    Station: allData.station,
                    Name: allData.info.name,
                    Date: allData.time.dt.split("T")[0],
                    Time: [allData.time.repr.slice(2, 4), ":", allData.time.repr.slice(4, 6)].join(""),
                    Wind: allData.translate.wind,
                    Visibility: allData.translate.visibility,
                    Weather: allData.wx_codes[0] ? allData.wx_codes[0]?.value : "All Clear",
                    SkyCondition: allData.translate.clouds ? allData.translate.clouds : allData.clouds[0]?.repr + allData.units,
                    Temperature: allData.translate.temperature,
                    DewPoint: allData.translate.dewpoint,
                    Altimeter: allData.translate.altimeter,
                    Raw: allData.raw
                }
                const id = interaction.options.getString('id').toUpperCase();
                const titleFields = [`${interaction.command.name.toUpperCase()} Data`, `for ICAO Code ${id}`]
                const fieldNames = Object.keys(data)
                const fields = Object.values(data)
                const embed = await embedCreate(titleFields, fields, fieldNames)
                interaction.followUp({ embeds: [embed] })
                return
            }
        } catch (e) {
            return interaction.followUp("no data")
        }

    }
}) 