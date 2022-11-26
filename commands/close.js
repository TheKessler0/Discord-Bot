const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { reportRole, reportChannelId, verifyRole, verifyChannelId, jailChannelId } = require('../config.json');
const fs = require('fs');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('close')
		.setDescription('closes tickets'),
	async execute(interaction, client) {

		//Fetch member and guild information
		await interaction.guild.fetch()
		await interaction.member.fetch()

		//IS STAFF?
		if (interaction.member.roles.cache.some(role => role.id === reportRole || role.id === verifyRole)) {

			//IS RIGHT THREAD?
			if ((interaction.channel.parentId === reportChannelId || interaction.channel.parentId === verifyChannelId || interaction.channel.parentId === jailChannelId ) && interaction.channel.isThread()) {

				//DELETE THREAD
				await interaction.reply({ content: `thread will be deleted soon...`, ephemeral: false })
				await interaction.channel.delete(`closing ticket ${interaction.channel.name}`);
			}

			else { //WRONG CHANNEL OR NOT A THREAD
				await interaction.reply({ content: `You can only use this command in **threads** of either <#${reportChannelId}>, <#${verifyChannelId}> or <#${jailChannelId}>`, ephemeral: true })
			}
		}

		else { //NOT STAFF
			await interaction.reply({ content: `${interaction.user} staff will close this ticket, not you!`, ephemeral: false })
		}
	}
};