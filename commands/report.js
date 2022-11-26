const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { reportChannelId, reportRole } = require('../config.json');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription('creates a ticket to report something to staff'),
	async execute(interaction, client) {

		const channel = await client.channels.cache.get(reportChannelId);
		const thread = await channel.threads.create({
			name: interaction.user.tag.replace(/#[0-9]{4}$/gm, "") + " " + interaction.user.id,
			autoArchiveDuration: 60,
			type: ChannelType.PrivateThread,
			invitable: false,
			reason: `${interaction.user.id} reporting to staff`
		});

		await interaction.guild.members.fetch()
		await interaction.guild.roles.cache.get(reportRole).members.forEach(member => { thread.members.add(member) })
		await thread.members.add(interaction.user)

		fs.readFile("./messages/report reply.txt", "utf8", async function (err, data) { if (err) throw err; await interaction.reply({ content: data, ephemeral: true }) });
		fs.readFile("./messages/report intro.txt", "utf8", async function (err, data) { if (err) throw err; await thread.send(`${interaction.user}\n` + data) });
	}
};