import { Command } from '../../structures/Command'
import Discord, { Message, MessageSelectMenu, Permissions } from 'discord.js'
import { isAuthorModerator } from '../../permissionsHandler'
import { embedCreate } from '../../structures/EmbedCreate'


export default new Command({
    name: "timeout",
    description: "Is someone being naughty? time them out for a set amount of time. ",
    options: [
        {
            name: "user",
            description: `User tag to timeout`,
            required: true,
            type: "USER",
        },
        {
            name: 'duration',
            description: `Put in the duration for the timeout (in minutes)`,
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'reason',
            description: `Put in the reason for the timeout`,
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
        }
    ],
    run: async ({ client, interaction }) => {
        if(!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            return interaction.followUp("You do not have required permissions to use this command")
        }
        try {
            const value = interaction.options.getNumber('duration')
            const duration = interaction.options.getNumber('duration') * 60 * 1000;
            const user = interaction.options.getUser('user')
            const reason = interaction.options.getString('reason')
            const member = interaction.guild.members.cache.get(user.id)

            let u = interaction.guild.members.cache.get(user.id)
            if(u.permissions.has(Permissions.FLAGS.BAN_MEMBERS || Permissions.FLAGS.KICK_MEMBERS)){
                return interaction.followUp("You cannot timeout another moderator or owner")
            }

            const data = [`${user.tag}`, ` Has been Muted for ${value} days`]
            member.timeout(duration, reason)
                .then(() => {
                    member.user.send(`You have been muted on **\`${interaction.guild.name}\`** for \`${value}\` day(s) for \`${reason}\``)
                    const embed = embedCreate(data, [], [])
                    interaction.followUp({ embeds: [embed] })
                })
                .catch(e => {
                    console.log(e)
                    interaction.followUp("The bot does not have enough permissions")
                })
        } catch (e) {
            console.log(e)
            interaction.followUp("Please check the bot permissions ")
        }
    }
}) 
