const api = "https://getpickuplines.herokuapp.com/lines/random"

import Discord from 'discord.js'
import { CommandInteractionOptionResolver, Interaction } from "discord.js";
import { isAuthorModerator } from "../../permissionsHandler";
import { Command } from "../../structures/Command";
const { SlashCommandBuilder } = require('@discordjs/builders')
const fetch = require('node-fetch')
export default new Command ({
    name: "pickup",
    description: "API fetch",
    options: [{
        name: 'user',
        description: 'user',
        required: false, 
        type: Discord.Constants.ApplicationCommandOptionTypes.MENTIONABLE
    }],
    run: (async ({client, interaction})=> {
        //if (!isAuthorModerator(interaction.member)) {return;}

        const response = await fetch(api)

        if (response.status === 200) { 
            const pickupLine = await response.json().then((j) => j.line).catch((error) => {interaction.followUp('Sorry, I think my AI Pickup Line brain had a hiccup, please try again in a while')})
            //interaction.followUp(pickupLine + interaction.options)))
            const person = interaction.options.getMentionable('user') ?? ""
            interaction.followUp(`${person.toString()} ${pickupLine}`)
            
        }
    })
})

