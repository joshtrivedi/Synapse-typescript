import { Event } from "../structures/Event";

export default new Event("guildCreate", (guild) => {
    const { id } = guild;
    console.log(`Joined guild ${id}`);
});