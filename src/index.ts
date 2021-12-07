import {Client} from "discordx";
import path from "path";
import {fileURLToPath} from "url";
import {Intents} from "discord.js";
import * as dotenv from 'dotenv'

dotenv.config()

const srcPath = path.dirname(fileURLToPath(import.meta.url))

if (process.env.GUILD_ID) {
    const client = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MEMBERS,
        ],
        classes: [
            `${srcPath}/commands/*.js`
        ],
        silent: false,
        botGuilds: [
            process.env.GUILD_ID
        ]
    })

    client.once('ready', async () => {
        await client.clearApplicationCommands()
        await client.initApplicationCommands()
        await client.initApplicationPermissions()
    })

    client.on('interactionCreate', async (interaction) => {
        await client.executeInteraction(interaction)
    })

    if (process.env.DISCORD_TOKEN) {
        client.login(process.env.DISCORD_TOKEN)
    }
}


