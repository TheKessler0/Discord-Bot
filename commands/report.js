const { SlashCommandBuilder, ChannelType, ThreadAutoArchiveDuration, DiscordAPIError, messageLink, Collection } = require('discord.js');
const fs = require('fs');
const { roleIds, channelIds } = require(`../config.json`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription('creates a ticket to report something to staff'),
	async execute(interaction, client) {
		
		if (interaction.channel == null) {
			return
		}

		await interaction.deferReply({ ephemeral: true });

		let ChannelId

		//Fetch all guild members
		await interaction.guild.members.fetch()

		if   /* IS JAILED   */ (interaction.member.roles.cache.some(role => role.id === roleIds.muted)) { ChannelId = channelIds.jail }
		else /* ISNT JAILED */ { ChannelId = channelIds.report }

		//Create NEW thread
		const channel = await client.channels.cache.get(ChannelId);
		const thread = await channel.threads.create({
			name: `[R] ${interaction.user.tag.replace(/#[0-9]{4}$/gm, "")}`,
			autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays,
			type: ChannelType.PrivateThread,
			invitable: false,
			reason: `${interaction.user.id} reporting to staff`
		});

		//ADD everyone to new 
		const rolesToAdd = [roleIds.owner, roleIds.seniorMod, roleIds.normMod, roleIds.juniorMod]
		for (const role of rolesToAdd) {
			await interaction.guild.roles.cache.get(role).members.forEach(member => { thread.members.add(member) })
		}
		await thread.members.add(interaction.user)

		//Send Messages
		fs.readFile("./messages/report reply.txt", "utf8", async function (err, data) { if (err) throw err; await interaction.followUp({ content: `${data}\nclick here: ${thread}`, ephemeral: true }) });
		fs.readFile("./messages/report intro.txt", "utf8", async function (err, data) { if (err) throw err; await thread.send(`${interaction.user}\n${data}`) });

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