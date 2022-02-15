import { isAuthorModerator } from "../../permissionsHandler";
import { Command } from "../../structures/Command";

export default new Command({
    name: "motivation",
    description: "replies with pong",
    run: async ({ client, interaction }) => {
        if(isAuthorModerator(interaction.member)) {interaction.followUp("are bhai bhai bhai bhai bhai jaan bach gayi")}
        else {interaction.followUp("are bhai bhai bhai bhai gaand fatt gayi")}
    }
});