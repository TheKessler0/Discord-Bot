const { SlashCommandBuilder, ChannelType } = require('discord.js');
const {  } = require('../config.json');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('')
		.setDescription(''),
	async execute(interaction, client) {

		const amountToPrune = 100

		await interaction.guild.members.fetch()
		await interaction.guild.roles.fetch()

		let pruned = Infinity
		for (let i = 0;pruned > amountToPrune;i++) {
			interaction.guild.members.prune({dry: true, days: i, roles: [`${interaction.guild.roles.everyone}`]})
		}
	}
};