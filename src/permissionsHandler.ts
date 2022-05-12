import { Client, Guild, GuildMember, Message, MessageEmbed, PartialGuildMember, TextChannel, Interaction, ClientApplication, ApplicationCommandDataResolvable, ApplicationCommandPermissionData } from "discord.js"
import { promisify } from "util";
import { Command } from "./structures/Command";
import { glob } from "glob";
import { CommandType } from "./typings/Command";
import { client } from "./index";
const globPromise = promisify(glob);
export const isAuthorModerator = (member: GuildMember): boolean => {
    if (member.roles.hoist) {
        return member.roles.hoist.name === process.env.MODERATOR_ROLE_NAME;
    } else {
        return false;
    }
}

export const hasRole = (
    member: GuildMember, PartialGuildMember,
    roleName: string
): boolean => {
    return !!member.roles.cache.find((r) => r.name === roleName);
}

export const isRegistered = (
    member: GuildMember, PartialGuildMember
): boolean => {
    return !!member.roles.cache.find((r) => r.id === process.env.MEMBER_ROLE_ID);
};

export const isTimedout = (
    member: GuildMember, PartialGuildMember
): boolean => {
    return !!member.roles.cache.find((r) => r.id === process.env.TIMEOUT_ROLE_ID);
}


export async function slashCommandsPermissions(id: string) {
    const command = await client.guilds.cache?.get(process.env.guildId)?.commands.fetch(id);
    const permissions: ApplicationCommandPermissionData[] =
        [
            {
                id: '948267034775523403',
                type: 'ROLE',
                permission: true
            },
        ];
    
    await command.permissions.add({permissions});
}