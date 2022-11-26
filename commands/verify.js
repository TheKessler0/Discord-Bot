const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { verifyChannelId, verifyRole, jailChannelId, jailedRole } = require('../config.json');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('creates a ticket to hopefully verify you'),
	async execute(interaction, client) {

		let ChannelId

		await interaction.guild.members.fetch()

		if   /* yes jailed */ (interaction.member.roles.cache.some(role => role.id === jailedRole)) { ChannelId = jailChannelId}
		else /* not jailed */ { ChannelId = verifyChannelId}

		const channel = await client.channels.cache.get(ChannelId);
		const thread = await channel.threads.create({
			name: interaction.user.tag.replace(/#[0-9]{4}$/gm, "") + " " + interaction.user.id,
			autoArchiveDuration: 60,
			type: ChannelType.PrivateThread,
			invitable: false,
			reason: `${interaction.user.id} trying to verify`
		});

		await interaction.guild.roles.cache.get(verifyRole).members.forEach(member => { thread.members.add(member) })
		await thread.members.add(interaction.user)

		fs.readFile("./messages/verify reply.txt", "utf8", async function (err, data) { if (err) throw err; await interaction.reply({ content: data, ephemeral: true }) });
		fs.readFile("./messages/verify intro.txt", "utf8", async function (err, data) { if (err) throw err; await thread.send(`${interaction.user}\n` + data) });
	}
};