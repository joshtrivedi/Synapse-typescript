//Empty command 
import { Command } from '../../structures/Command'
import Discord from 'discord.js'
import { isAuthorModerator } from '../../permissionsHandler'
import { embedCreate } from '../../structures/EmbedCreate'


export default new Command({
    name: "zulu",
    description: "command to fetch TAF data for an id",
    run: async ({ client, interaction }) => {
        const now = new Date()
        const zulu = now.toUTCString()
        interaction.followUp(zulu.replace(/GMT/g, "UTC"))
    }
})
