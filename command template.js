const { SlashCommandBuilder, ChannelType } = require('discord.js');
const {  } = require('../config.json');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('')
		.setDescription(''),
	async execute(interaction, client) {}
};