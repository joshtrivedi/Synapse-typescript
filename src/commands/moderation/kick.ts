import { Permissions } from "discord.js";
import { Command } from "../../structures/Command";
import { embedCreate } from "../../structures/EmbedCreate";
import Discord from "discord.js";
export default new Command({
    name: "kick",
    description: "Kick a member from this server.",
    options: [
        {
            name: "user",
            description: `User tag to kick`,
            required: true,
            type: "USER",
        },
        {
            name: 'reason',
            description: `Put in the reason for the kick`,
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
        }
    ],
    run: async ({ client, interaction }) => {
        //check permission to kick members
        if(!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            return interaction.followUp("You do not have required permissions to use this command")
        }
        try {
            
            const reason = interaction.options.getString('reason')
            const user = interaction.options.getUser('user')
            const member = interaction.guild.members.cache.get(user.id)

            let u = interaction.guild.members.cache.get(user.id)
            if(u.permissions.has(Permissions.FLAGS.BAN_MEMBERS || Permissions.FLAGS.KICK_MEMBERS)){
                return interaction.followUp("You cannot kick another moderator or owner")
            }

            const data = [`${user.tag}`, ` Has been Kicked for ${reason}`]
            const embed = embedCreate(data, [], [])
            interaction.followUp({ embeds: [embed] })
            await member.user.send(`You have been kicked from **\`${interaction.guild.name}\`** for \`${reason}\``)
            try{member.kick(reason)}
            catch(e){
                console.log(e)
                interaction.followUp("Please check the Role precedence")
            }
           
        } catch (e) {
            console.log(e)
            interaction.followUp("Please check the bot permissions ")
        }
    }
})