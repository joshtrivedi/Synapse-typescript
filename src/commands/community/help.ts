import { MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name: "help",
    description: "Shows a list of available commands.",
    run: async ({ client, interaction }) => {
        const embed = new MessageEmbed()
            .setTitle("Available commands")
            .setDescription(
                client.commands
                    .map(command => `\`${command.name}\``)
                    .join("\n") 
            )
            .setColor("#0099ff")
            .setTimestamp()
            .setFooter(client.user.username, client.user.displayAvatarURL());
        interaction.reply({embeds: [embed]});
    }
})