import { Command } from '../../structures/Command'
import Discord from 'discord.js'
import { isAuthorModerator } from '../../permissionsHandler'
import { embedCreate } from '../../structures/EmbedCreate'
import fetch from 'node-fetch'

const url = "https://www.aviationweather.gov/"
const testApi = "https://www.aviationweather.gov/cgi-bin/json/TafJSON.php"
const checkColor = (color: string): boolean => {
    const reg = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    return reg.test(color)
}

export default new Command({
    name: "test",
    description: "testing command",
    options: [
        {
            name: "color",
            description: "color",
            required: false,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "title",
            description: "embed title",
            required: false,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "description",
            description: "embed description",
            required: false,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    run: async ({ client, interaction }) => {
        if (!isAuthorModerator(interaction.member)) {
            return interaction.followUp("not a mod")
        }

        const response = await fetch(testApi)

        if (response.status === 200) {
            const title = await response.json()
            Object.entries(title).forEach(([key, value]) => console.log(key,value))
        }

        // const args: string[] = [
        //     interaction.options.getString('color') ?? "#ffffff",
        //     interaction.options.getString('title') ?? "Please provider a title",
        //     interaction.options.getString('description') ?? "Please provide a description",]
        // interaction.followUp({ embeds: [embedCreate(args)] })

    }
})
