const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { roleIds, channelIds, token, clientId, guildId } = require(`./config.json`);

let abort = false
if (token === "") { abort = true; console.log(`[WARN] "token" missing, add it to "config.json"`) }
if (guildId === "") { abort = true; console.log(`[WARN] "guildId" missing, add it to "config.json"`) }
if (clientId === "") { abort = true; console.log(`[WARN] "clientId" missing, add it to "config.json"`) }
Object.entries(roleIds).forEach( trouple => {
	if (trouple[1] === "") {
		abort = true
		console.log(`[WARN] "${trouple[0]}" missing, add it to "config.json"`)
	}
});
Object.entries(channelIds).forEach( trouple => {
	if (trouple[1] === "") {
		abort = true
		console.log(`[WARN] "${trouple[0]}" missing, add it to "config.json"`)
	}
});
if (abort === true) {
	console.log('\n[INFO] SHUTTING DOWN')
	process.exit(1)
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') && !file.startsWith('[WIP]'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
		console.log(`[LOAD] Loaded the command "` + command.data.name + `" at ${filePath} successfully.`)
	}
	else if ('data' in command) {
		console.log(`[WARN] The command "` + command.data.name + `" at ${filePath} is missing the required "execute" property.`);
	}
	else if ('execute' in command) {
		console.log(`[WARN] The command "` + command.data.name + `" at ${filePath} is missing the required "data" property.`);
	}
	else {
		console.log(`[WARN] The command "` + command.data.name + `" at ${filePath} is missing the required "data" and "execute" properties.`);
	}
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`[BOOT] Logged in as ${c.user.tag} with ID ${c.user.id}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, client)
		console.log(`[EXEC] Command: "/${interaction.commandName}"\n       User:    "${interaction.user.tag.replace(/#[0-9]{4}$/gm, "")}"\n       ID:      "${interaction.user.id}"\n `);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


// Log in to Discord with your client's token
client.login(token);