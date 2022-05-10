import { Command } from "../../structures/Command";

export default new Command({
    name: "ping",
    description: "replies with pong",
    run: async ({ client, interaction }) => {
        interaction.followUp(`Pong! in about ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
    }
});