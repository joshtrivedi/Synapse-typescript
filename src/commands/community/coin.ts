import { Command } from "../../structures/Command";
import Discord, { Interaction } from "discord.js";

export default new Command({
    name: "flip",
    description: "Feeling lucky? Flip a coin.",
    run: async ({ client, interaction }) => {
        const channel: Discord.TextChannel = interaction.channel as Discord.TextChannel
        const coin = Math.floor(Math.random() * 2)
        if (coin === 0) {
            await interaction.followUp("Heads")
        } else {
            await interaction.followUp("Tails")
        }
    }
})