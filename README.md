# Discord-Bot

To get started, rename "example_config.json" to "config.json"
Fill that with all requested values!

Run "index.js"

FINISHED!


"config.json" should lokk like this: 
(i have added some comments here, these are NOT allowed in the actual file)

{
	"token":           "", //the bots application token
	"guildId":         "", //ID of the server (aka guild in the code)
	"reportChannelId": "", //ID of the channel reports-threads should go
	"verifyChannelId": "", //ID of the channel verify-threads should go
	"jailChannelId":   "", //ID of Jail, for jailed to verify
	"reportRole":      "", //ID of role that should see report-tickets
	"verifyRole":      "", //ID of role that should see verification-tickets
	"jailedRole":      ""  //ID of jailed- role
}