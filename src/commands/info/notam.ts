// import { Command } from '../../structures/Command'
// import Discord, { ButtonInteraction, Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from 'discord.js'
// import { embedCreate } from '../../structures/EmbedCreate'
// import axios from "axios"
// import { env } from 'process'

// const notamApiKey = env.notamApiKey;


// export interface Root {
//   type: string
//   features: Feature[]
//   results: Results
// }

// export interface Feature {
//   id: string
//   type: string
//   geometry: Geometry
//   properties: Properties
// }

// export interface Geometry {
//   type: string
//   geometries: Geometry2[]
// }

// export interface Geometry2 {
//   type: string
//   coordinates: any[]
//   lowerLimit?: LowerLimit
//   upperLimit?: UpperLimit
// }

// export interface LowerLimit {
//   reference: string
// }

// export interface UpperLimit {
//   uom: string
//   value: number
//   reference: string
// }

// export interface Properties {
//   lat: number
//   lon: number
//   text: string
//   type: string
//   year: number
//   qcode: string
//   scope: string
//   issued: string
//   number: number
//   radius: number
//   series: string
//   purpose: string
//   traffic: string
//   location: string
//   metadata: Metadata
//   maximumFL: number
//   minimumFL: number
//   affectedFIR: string
//   countryCode: string
//   effectiveEnd?: string
//   publisherNOF: string
//   relationship: Relationship
//   translations: Translation[]
//   effectiveStart: string
//   affectedAerodrome: string
//   schedule?: string
//   schedules?: Schedule[]
//   affectedEntities?: AffectedEntity[]
// }

// export interface Metadata {
//   geometrySources: string[]
//   lastUpdateTimestamp: string
// }

// export interface Relationship {
//   affectedFIR: AffectedFir
//   reference?: Reference
// }

// export interface AffectedFir {
//   id: string
//   href: string
// }

// export interface Reference {
//   year: number
//   number: number
//   series: string
// }

// export interface Translation {
//   type: string
//   formattedText?: string
//   simpleText?: string
// }

// export interface Schedule {
//   endTime: string
//   frequency: string
//   startTime: string
// }

// export interface AffectedEntity {
//   type: string
//   closure: string
//   designators: string[]
// }

// export interface Results {
//   publishTime: string
//   status: string
//   total: number
// }

// export interface MyData {
//   Text: string
//   Issued: string
//   EffectiveEnd?: string
//   Location: string
// }

// export default new Command({
//   name: "notam",
//   description: "Fetches NOTAM data for Airport ICAO",
//   options: [{
//     name: "id",
//     description: "ICAO code for airport",
//     required: true,
//     type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
//   },
//   ],
//   run: async ({ client, interaction }) => {

//     const icao = interaction.options.getString('id').toUpperCase()
//     const apiLink = `https://api.laminardata.aero/v2/icao-prefixes/${icao[0]}/firs/${icao}/notams?user_key=${notamApiKey}`
//     const embeds: MessageEmbed[] = []
//     const response = await axios.get(apiLink, { headers: { Accept: "application/json" } })
//     if (response.status === 404) {
//       return interaction.followUp(`No NOTAMs found for this airport`)
//     }
//     if (response.status === 200) {
//       const data = response.data
//       const MappedData: Root = JSON.parse(JSON.stringify(data))
//       //if mappeddata is empty, return error
//       if (MappedData.features.length === 0 || MappedData.features === undefined) {
//         return interaction.followUp(`No NOTAMs found for this airport`)
//       }
//       MappedData.features.forEach(element => {
//         var mydata: MyData = {
//           Text: element.properties.text.length < 1024 ? element.properties.text : element.properties.text.substring(0, 1021) + "...",
//           Issued: [element.properties.issued.split("T")[0], element.properties.issued.split("T")[1].split("Z")[0]].join(" "), 
//           EffectiveEnd: element.properties.effectiveEnd ?? "N/A" ,
//           Location: element.properties.location ?? "N/A",
//         }
//         var fieldValues = Object.values(mydata)
//         var fieldNames = Object.keys(mydata)
//         var title = [`NOTAM `, `Notams for ${icao}`]
//         var embed = embedCreate(title, fieldValues, fieldNames)
//         embeds.push(embed)
//       })
//       const pages = {} as { [key: string]: number }

//       const getRow = (id: string) => {
//         const row = new MessageActionRow()
//           .addComponents(
//             new MessageButton()
//               .setCustomId("prev_embed")
//               .setStyle('SECONDARY')
//               .setEmoji('⬅')
//               .setDisabled(pages[id] === 0)
//           )
//           .addComponents(
//             new MessageButton()
//               .setCustomId("next_embed")
//               .setStyle('SECONDARY')
//               .setEmoji('➡')
//               .setDisabled(pages[id] === embeds.length - 1)
//           )
//         return row
//       }


//       const id1 = interaction.user.id
//       pages[id1] = pages[id1] || 0

//       const embed = embeds[pages[id1]]

//       let reply: Message | undefined

//       const filter = (btnInt: MessageComponentInteraction) => {
//         return (btnInt.user.id === interaction.user.id)
//       }

//       interaction.followUp({
//         embeds: [embed],
//         components: [getRow(id1)]
//       })

//       const collector = interaction.channel.createMessageComponentCollector({
//         filter: filter,
//         time: 1000 * 60 * 5
//       })

//       collector.on('collect', async (btnInt: ButtonInteraction) => {
//         if (!btnInt) { return }
//         if (btnInt.customId !== 'prev_embed' && btnInt.customId !== 'next_embed') { return }

//         if (btnInt.customId === 'prev_embed' && pages[id1] > 0) {
//           --pages[id1]
//         } else if (btnInt.customId === 'next_embed' && pages[id1] < embeds.length - 1) {
//           ++pages[id1]
//         }
//         interaction.editReply({
//           embeds: [embeds[pages[id1]]],
//           components: [getRow(id1)]
//         })
//       })
//       collector.on('end', (collected, reason) => {
//         if (reason === 'time') {
//           interaction.editReply({
//             embeds: [embeds[pages[id1]].setFooter("The interaction has expired")],
//           })
//         }
//       })
//     }
//     else {
//       interaction.reply("No NOTAM's found for this airport")
//     }
//   }
// })
