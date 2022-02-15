import { Client, Guild, GuildMember, Message, MessageEmbed, PartialGuildMember, TextChannel, Interaction } from "discord.js"


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