import { Command } from '../../structures/Command'
import Discord, { Message, MessageSelectMenu } from 'discord.js'
import { isAuthorModerator } from '../../permissionsHandler'
import { embedCreate } from '../../structures/EmbedCreate'
import axios from "axios"
const simBriefToken = process.env.SIMBRIEF_TOKEN
const api = `api.simbox.org/ofp/?token=${simBriefToken}&username=lauder`


export default new Command({
    name: "test",
    description: "command to fetch TAF data for an id",
    options: [
        {
            name: "id",
            description: `Put in the ID for Taf`,
            required: true,
            type: "USER",
        },
    ],
    run: async ({ client, interaction }) => {
        if (!isAuthorModerator(interaction.member)) {
            return interaction.followUp("You do not have required permissions to use this command")
        }
    }
}) 
