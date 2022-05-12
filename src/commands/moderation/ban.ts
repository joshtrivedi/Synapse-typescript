import { Command } from '../../structures/Command'
import Discord from 'discord.js'
import { isAuthorModerator } from '../../permissionsHandler'
import { embedCreate } from '../../structures/EmbedCreate'


export default new Command({
    name: "ban",
    description: "ban users by username",
    options: [
        {
            name: "id",
            description: `User tag to ban`,
            required: true,
            type: "USER",
        },
        {
            name: 'reason',
            description: `Put in the reason for the ban`,
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
        }
    ],
    run: async ({ client, interaction }) => {
        if (!isAuthorModerator(interaction.member)) {
            return interaction.followUp("You do not have required permissions to use this command")
        }
        try {
            const reason = interaction.options.getString('reason')
            const user = interaction.options.getUser('id')
            const member = interaction.guild.members.cache.get(user.id)

            const data = [`${user.tag}`, ` Has been Banned for ${reason}`]
            const embed = embedCreate(data, [], [])
            interaction.followUp({ embeds: [embed] })
            await member.user.send(`You are banned from **\`${interaction.guild.name}\`** for \`${reason}\``)
            member.ban({ reason })
        } catch (e) {
            console.log(e)
            interaction.followUp("Please check the bot permissions ")
        }
    }
})