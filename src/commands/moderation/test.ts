// import { Command } from '../../structures/Command'
// import Discord, { Message, MessageSelectMenu } from 'discord.js'
// import { isAuthorModerator } from '../../permissionsHandler'
// import { embedCreate } from '../../structures/EmbedCreate'
// import axios from "axios"
// const simBriefToken = process.env.SIMBRIEF_TOKEN
// const api = `api.simbox.org/ofp/?token=${simBriefToken}&username=lauder`


// export default new Command({
//     name: "reset",
//     description: "Reset guild commands",
//     run: async ({ client, interaction }) => {
//         if(!isAuthorModerator(interaction.member)) {
//             return interaction.followUp("You do not have permission to use this command.")
//         }
//         client.application.commands.set([])
//         .then(() => {
//             interaction.followUp("Global Commands reset.")
//         })
//     }
// }) 
