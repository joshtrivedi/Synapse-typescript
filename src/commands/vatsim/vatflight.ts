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
    Pilot_name: string
    CID: number
    Flight_rules: string
    Aircraft: string
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
    name: "vatflight",
    description: "command to fetch latest activity for airport",
    options: [
        {
            name: "callsign",
            description: `Flight callsign`,
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
        }
    ],
    run: async ({ client, interaction }) => {
        const embeds: MessageEmbed[] = []
        const flight = interaction.options.getString('callsign').toUpperCase()
        handler.getFlightInfo(flight).then((data: Pilot1) => {
            if (data === undefined) {
                return interaction.followUp("No data found for that Callsign")
            }
            //map data to myVatsimFlight
            var myVatsimFlight: myVatsimFlight = {
                Callsign: data.callsign ?? "Callsign not found",
                Pilot_name: data.name ?? "Pilot not found",
                CID: data.cid ?? 0,
                Flight_rules: data.flight_plan.flight_rules+"FR" ?? "Flight rules not found",
                Aircraft: data.flight_plan.aircraft.split('/')[0] ?? "Aircraft not found",
                Departure: data.flight_plan.departure ?? "Departure not found",
                Arrival: data.flight_plan.arrival ?? "Arrival not found",
                Alternate: data.flight_plan.alternate ?? "Alternate not found",
                Route: data.flight_plan.route ?? "Route not found",
                LogOn_Time: data.logon_time ?? "Logon time not found",
                Remarks: data.flight_plan.remarks ?? "Remarks not found",
            }
            var titleFields = Object.keys(myVatsimFlight)
            var titleValues = Object.values(myVatsimFlight)
            var title = [`Vatsim Data For :`, `Flight ${flight}`]
            var embed = embedCreate(title, titleValues, titleFields)
            embeds.push(embed)
            interaction.followUp({ embeds: [embed] })
        })
    }
})