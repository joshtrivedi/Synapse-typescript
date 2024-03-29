import { Command } from '../../structures/Command'
import Discord, { Permissions } from 'discord.js'
import { isAuthorModerator } from '../../permissionsHandler'
import { embedCreate } from '../../structures/EmbedCreate'


export default new Command({
    name: "ban",
    description: "Ban a member from this server.",
    options: [
        {
            name: "user",
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
        //check permission to ban members
        if(!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            return interaction.followUp("You do not have required permissions to use this command")
        }
        try {
            const reason = interaction.options.getString('reason')
            const user = interaction.options.getUser('user')
            const member = interaction.guild.members.cache.get(user.id)

            let u = interaction.guild.members.cache.get(user.id)
            if(u.permissions.has(Permissions.FLAGS.BAN_MEMBERS || Permissions.FLAGS.KICK_MEMBERS)){
                return interaction.followUp("You cannot ban another moderator or owner")
            }

            const data = [`${user.tag}`, ` Has been Banned for ${reason}`]
            const embed = embedCreate(data, [], [])
            interaction.followUp({ embeds: [embed] })
            await member.user.send(`You are banned from **\`${interaction.guild.name}\`** for \`${reason}\``)
            try{member.ban({ reason })}catch(e){
                console.log(e) 
                interaction.followUp("Please check the Role precedence")
            }
        } catch (e) {
            console.log(e)
            interaction.followUp("Please check the bot permissions ")
        }
    }
})