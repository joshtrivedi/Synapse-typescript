import Discord, { DiscordAPIError, Guild, GuildMember, Message, MessageAttachment, MessageEmbed } from "discord.js";
import { isAuthorModerator } from "../../permissionsHandler";
import { Command } from "../../structures/Command";
import Commando = require("discord.js-commando");

export default new Command({
    name: "create",
    description: "Post a screenshot and add reactions to it",
    options: [{
        name: "argument",
        description: "screenshot / giveaway",
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
    },
    {
        name: "time",
        description: "time limit for the screenshots / giveaway (in hours)",
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER,
    },
    ],
    run: async ({ client, interaction }) => {
        //check if user is mod
        if (!isAuthorModerator(interaction.member)) { return }


        const command = interaction.options.getString("argument");
        const time = interaction.options.getNumber("time") * 1000;


        switch (command) {
            case "screenshot":
                {
                    await interaction.followUp(`the screenshot competition has started! send your submissions in ${time / 1000} seconds!`);
                    const screenshotChannel = interaction.channel as Discord.TextChannel;

                    const filter = (m: Message) => {
                        return m.attachments.size > 0 && m.attachments.size < 2
                    }

                    const collector = screenshotChannel.createMessageCollector({ filter, time: time });
                    const screenshotEmbeds: MessageEmbed[] = [];
                    const screenshotMessages: Message[] = [];
                    collector.on("collect", async (message: Message) => {
                        const embed = new Discord.MessageEmbed()
                            .setTitle("Screenshot submission by " + message.author.tag)
                            .setDescription(`${message.author}`)
                            .setImage(message.attachments.first()?.url)
                            .setTimestamp()

                        const msg = await screenshotChannel.send({ embeds: [embed] });
                        screenshotEmbeds.push(embed);
                        screenshotMessages.push(msg);
                        msg.react("👍");
                        msg.react("👎");
                        message.delete();
                    })


                    collector.on("end", async (collected) => {
                        //count how many people reacted with ✅ on each image and who had the most reactions
                        const reactionCounts: { [key: string]: number } = {};
                        const reactionUsers: { [key: string]: string[] } = {};
                        const messageEmbeds: MessageEmbed[] = [];
                        for (const msg of screenshotMessages) {
                            const reaction = msg.reactions.cache.find(r => r.emoji.name === "👍");
                            if (reaction) {
                                const users = await reaction.users.fetch();
                                const userCount = users.size;
                                reactionCounts[msg.url] = userCount;
                                reactionUsers[msg.url] = users.map(u => u.id);
                                const embed = screenshotEmbeds.find(e => e.url === msg.url);
                                messageEmbeds.push(embed);
                            }
                        }

                        const max = Math.max(...Object.values(reactionCounts));
                        const maxKey = Object.keys(reactionCounts).find(k => reactionCounts[k] === max);
                        const maxUsers = reactionUsers[maxKey];
                        const maxMessage = screenshotMessages.find(m => m.url === maxKey);
                        const maxAuthor = `${maxMessage.embeds.map(m => m.description)}`


                        const winnerEmbed: MessageEmbed = new Discord.MessageEmbed()
                            .setTitle("Screenshot Winner")
                            .setDescription(maxAuthor)
                            .setImage(maxMessage.attachments.first()?.url)
                            .addField("Reactions: ", `${max}`)
                            .setTimestamp()
                            .setColor("#00ff00")


                        const winMsg = await interaction.channel.send({ embeds: [winnerEmbed] })
                        winMsg.react("🎉");
                    })
                    break;
                }
            default: {
                interaction.reply("invalid command/ please enter `screenshot`");
                break;
            }
        }
    }
})