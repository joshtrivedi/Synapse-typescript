import { CommandInteractionOptionResolver, Interaction } from "discord.js";
import { isAuthorModerator } from "../../permissionsHandler";
import { Command } from "../../structures/Command";
const { SlashCommandBuilder } = require('@discordjs/builders')



export default new Command({
    name: "purge",
    description: "deletes messages",
    run: (async ({client, interaction}) =>{
        if (isAuthorModerator(interaction.member)){

            interaction.followUp("Yes its working")

        }
        else console.log("Something broke")
    })
})