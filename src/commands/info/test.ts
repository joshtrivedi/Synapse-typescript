import { Command } from '../../structures/Command'
import Discord from 'discord.js'
import { isAuthorModerator } from '../../permissionsHandler'
import { embedCreate } from '../../structures/EmbedCreate'


export default new Command({
    name: "test",
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
        if (!isAuthorModerator(interaction.member)) {
            return interaction.followUp("not a mod")
        }

        const testTitles = ["1", "2", "3", "4", "5", "6", "7"]
        const testValues = ["one", "two", "three", "four", "five", "six", "seven"]

        const embed = await embedCreate(["Test Embed", "Testing the Embed function"], testTitles, testValues)
        interaction.followUp({embeds: [embed]})

    }
}) 