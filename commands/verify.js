const { SlashCommandBuilder, ChannelType, ThreadAutoArchiveDuration } = require('discord.js');
const { roleIds, channelIds } = require(`../config.json`);
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('creates a ticket to hopefully verify you'),
	async execute(interaction, client) {

		await interaction.deferReply({ ephemeral: true });

		let ChannelId

		//Fetch all guild members
		await interaction.guild.members.fetch()

		if   /* IS JAILED   */ (interaction.member.roles.cache.some(role => role.id === roleIds.muted)) { ChannelId = channelIds.jail }
		else /* ISNT JAILED */ { ChannelId = channelIds.verify }

		//Create NEW thread
		const channel = await client.channels.cache.get(ChannelId);
		const thread = await channel.threads.create({
			name: `[V] ${interaction.user.tag.replace(/#[0-9]{4}$/gm, "")}`,
			autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays,
			type: ChannelType.PrivateThread,
			invitable: false,
			reason: `${interaction.user.id} trying to verify`
		});

		//ADD everyone to new 
		const rolesToAdd = [roleIds.owner]
		for (const role of rolesToAdd) {
			await interaction.guild.roles.cache.get(role).members.forEach(member => { thread.members.add(member) })
		}
		await thread.members.add(interaction.user)

		//Send Messages
		fs.readFile("./messages/verify reply.txt", "utf8", async function (err, data) { if (err) throw err; await interaction.followUp({ content: data, ephemeral: true }) });
		fs.readFile("./messages/verify intro.txt", "utf8", async function (err, data) { if (err) throw err; await thread.send(`${interaction.user} ${data}`) });

		//close ticket if no activity
		await thread.awaitMessages({
			time: 1000 * 60 * 60,
			errors: [`time`],
			max: 1,
			filter: m => m.author.id == interaction.user.id
		})
			.then()
			.catch(collected => { thread.delete(`member sent ${collected.size} messages in 1H after ticket creation`) })
	}
};