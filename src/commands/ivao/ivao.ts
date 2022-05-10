// import { Command } from '../../structures/Command'
// import Discord, { ButtonInteraction, Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageSelectMenu } from 'discord.js'
// import { isAuthorModerator } from '../../permissionsHandler'
// import { embedCreate } from '../../structures/EmbedCreate'
// import axios from "axios"
// import { Channel, channel } from 'diagnostics_channel'

// const simBriefToken = process.env.SIMBRIEF_TOKEN
// const api = `api.simbox.org/ofp/?token=${simBriefToken}&username=lauder`


// export default new Command({
//     name: "ivao",
//     description: "command to fetch TAF data for an id",
//     options: [
//         {
//             name: "id",
//             description: `Put in the ID for Taf`,
//             required: true,
//             type: "USER",
//         },
//     ],
//     run: async ({ client, interaction }) => {
//         if (!isAuthorModerator(interaction.member)) {
//             return interaction.followUp("You do not have required permissions to use this command")
//         }

//         const row = new MessageActionRow() 
//         .addComponents(
//             new MessageButton()
//             .setCustomId('prev')
//             .setLabel('<')
//             .setStyle('SUCCESS')
//         )
//         .addComponents(
//             new MessageButton()
//             .setCustomId('next')
//             .setLabel('>')
//             .setStyle('SUCCESS')
//         )


        


//         //const response = await axios.get(api, { headers: { 'Authorization': `Bearer ${simBriefToken}` } })
//         await interaction.followUp({
//             content: "testing this shit",
//             components: [row],
//         })

//         const filter = (btnInt: MessageComponentInteraction) => {
//             return (btnInt.user.id === interaction.user.id)
//         }
//         const collector = interaction.channel.createMessageComponentCollector({
//             filter: filter,
//             time: 1000 * 15
//         })


//         collector.on('collect', async (btnInt: ButtonInteraction) => {
//             if (btnInt.customId === 'prev') {
//                 await interaction.editReply({
//                     content: "yeah you pressed prev shit",
//                     components: [row],
//                 })
               
//             } else if (btnInt.customId === 'next') {
//                 await interaction.editReply({
//                     content: "yeah you pressed next shit",
//                     components: [row],
//                 })
//             }
//         })
 
//         collector.on('end', async (collection) => {
//             await interaction.editReply({
//                 content: "yeah the embed has expired",
//                 components: [row],
//             })
//         })
//     }
// }) 
