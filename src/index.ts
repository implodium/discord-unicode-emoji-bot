import {Client} from "discordx";
import path from "path";
import {fileURLToPath} from "url";
import {Intents} from "discord.js";
import * as dotenv from 'dotenv'

initEnvironment()
const client = getClient()
initCommands()
await startBot()

function isProduction() {
    return process.env.NODE_ENV && process.env.NODE_ENV === 'production'
}

function initEnvironment() {
    if (!isProduction()) {
        dotenv.config({path: `${process.cwd()}/.env.dev`})
    }
}

function getClient(): Client {
    const srcPath = path.dirname(fileURLToPath(import.meta.url))

    if (isProduction()) {
        return getProductionClient(srcPath)
    } else {
        return getDevelopmentClient(srcPath)
    }
}

function getProductionClient(srcPath: string): Client {
    return new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MEMBERS,
        ],
        classes: [
            `${srcPath}/commands/*.js`
        ],
        silent: false,
    })
}

function getDevelopmentClient(srcPath: string): Client {
    return new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MEMBERS,
        ],
        classes: [
            `${srcPath}/commands/*.js`
        ],
        silent: false,
        botGuilds: process.env.BOT_GUILD ? [process.env.BOT_GUILD] : undefined
    })
}

function initCommands() {
    initCommandStructures()
    initCommandInteraction()
}

function initCommandStructures() {
    client.once('ready', async () => {
        await client.clearApplicationCommands()
        await client.initApplicationCommands()
        await client.initApplicationPermissions()
    })
}

function initCommandInteraction() {
    client.on('interactionCreate', async (interaction) => {
        await client.executeInteraction(interaction)
    })
}

async function startBot() {
    if (process.env.DISCORD_TOKEN) {
        await client.login(process.env.DISCORD_TOKEN)
    }
}

