const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { roleIds, channelIds } = require(`../config.json`);
const fs = require('fs');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('close')
		.setDescription('closes tickets'),
	async execute(interaction, client) {

		if (interaction.channel == null) {
			return
		}
		
		await interaction.deferReply({ ephemeral: true });

		//Fetch member and guild information
		await interaction.guild.fetch()
		await interaction.member.fetch()

		//IS STAFF?
		if (interaction.member.roles.cache.some(role => role.id === roleIds.owner || role.id === roleIds.seniorMod || role.id === roleIds.normMod || role.id === roleIds.juniorMod)) {

			//IS RIGHT THREAD?
			if ((interaction.channel.parentId === channelIds.report || interaction.channel.parentId === channelIds.verify || interaction.channel.parentId === channelIds.jail ) && interaction.channel.isThread()) {

				//DELETE THREAD
				await interaction.followUp({ content: `thread will be deleted soon...`, ephemeral: true })
				await interaction.channel.delete(`closing ticket ${interaction.channel.name}`);
			}

			else { //WRONG CHANNEL OR NOT A THREAD
				await interaction.followUp({ content: `You can only use this command in **threads** of either <#${channelIds.report}>, <#${channelIds.verify}> or <#${channelIds.jail}>`, ephemeral: true })
			}
		}

		else { //NOT STAFF
			await interaction.followUp({ content: `${interaction.user} staff will close this ticket, not you!`, ephemeral: true })
			await interaction.followUp({ content: `__***${interaction.user} tried to close the ticket***__`, ephemeral: false })
		}
	}
};