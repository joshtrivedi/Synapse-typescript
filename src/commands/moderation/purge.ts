import Discord from 'discord.js'
import { DMChannel, Message, TextChannel } from 'discord.js';
import { CommandInteractionOptionResolver, Interaction } from "discord.js";
import { Command } from "../../structures/Command"
import { isAuthorModerator } from '../../permissionsHandler';
import { channel } from 'diagnostics_channel';
const { SlashCommandBuilder } = require('@discordjs/builders')


export default new Command({
    name: "purge",
    description: "deletes number of messages from chat",
    options: [{
        name: "args",
        description: "number of messages to delete",
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
    }],
    userPermissions: ["MANAGE_MESSAGES"],
    run: (async ({ client, interaction }) => {
        if (!isAuthorModerator(interaction.member)) {
            interaction.followUp("Author is not a moderator")
            return
        }
        const numberOfMessagesToDelete = await interaction.options.getNumber('args')
        if(!(numberOfMessagesToDelete > 1)){
            interaction.followUp("Delete that one message manually.")
            return
        }

        if(interaction.channel.type == "DM") return;
        
        const mess = await (interaction.channel as TextChannel)

        mess.bulkDelete(numberOfMessagesToDelete, true)
        .then(done => interaction.channel.send(`Deleted ${numberOfMessagesToDelete} messages successfully`)).then(msg => {
            setTimeout(() => {
                msg.delete(), 2000
            })
        }).catch(err => {console.error(err)})
        .catch(err => {
            console.error(err)
            interaction.channel.send("Something went wrong").then(msg => {
                setTimeout(() => {
                    msg.delete(), 2000
                })
            }).catch(err => {console.error(err)})
        })
    })
})

