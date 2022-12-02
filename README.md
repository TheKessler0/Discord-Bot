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
	"channelIds.report": "", //ID of the channel reports-threads should go
	"channelIds.verify": "", //ID of the channel verify-threads should go
	"channelIds.jail":   "", //ID of Jail, for jailed to verify
	"roleIds.normMod":       "", //ID of role that should see report-tickets
	"roleIds.seniorMod":  "", //ID of role that should see verification-tickets
	"roleIds.muted":     ""  //ID of jailed-role
}