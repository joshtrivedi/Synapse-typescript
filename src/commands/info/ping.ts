import { MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name: "ping",
    description: "replies with pong",
    run: async ({ client, interaction }) => {
        //interaction.followUp(`Pong! in about ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
        //Make pong embed
        const embed = new MessageEmbed()
            .setTitle("Pong!")
            .setDescription(`Pong! in about ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`)
            .setColor("#0099ff")
            .setTimestamp()
        interaction.followUp({embeds: [embed]});
    }
});