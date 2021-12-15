import {ButtonComponent, Discord, Once, Slash, SlashChoice, SlashGroup, SlashOption} from "discordx";
import {ButtonInteraction, CommandInteraction, MessageEmbedFooter} from "discord.js";
import figlet from 'figlet'
import * as fs from "fs";
import ListMessageBuilder from "../util/ListMessageBuilder.js";


enum Fonts {
    "Star Wars" = "Star Wars",
    "Sub-Zero" = "Sub-Zero",
    "Weird" = "Weird",
    "Univers" = "Univers",
    "Speed" = "Speed",
    "Puffy" = "Puffy",
    "Nipples" = "Nipples",
    "Larry 3D" = "Larry 3D",
    "Isometric1" = "Isometric1",
    "Impossible" = "Impossible",
    "3D-ASCII" = "3D-ASCII",
    "Whimsy" = "Whimsy",
    "Wet Letter" = "Wet Letter",
    "Twisted" = "Twisted",
    "Train" = "Train",
    "Tombstone" = "Tombstone",
    "THIS" = "THIS",
    "Small Keyboard" = "Small Keyboard",
    "Rammstein" = "Rammstein",
    "Pyramid" = "Pyramid",
    "Puzzle" = "Puzzle",
    "Pebbles" = "Pebbles",
    "Moscow" = "Moscow",
    "Katakana" = "Katakana",
    "JS Stick Letters" = "JS Stick Letters",
}

@Discord()
@SlashGroup('text')
export default class TextCommand {

    fontFileLocation = "/resources/fonts.txt"
    fonts?: Promise<string>

    @Slash('write', {description: 'sends text in ascii format'})
    async sendText(

        @SlashOption('text', {
            required: true,
            description: "Text to convert to ascii art"
        })
            text: string,

        @SlashChoice(Fonts)
        @SlashOption('font', {
            required: false,
            description: "Selecting a font from the drop down (limit 25)"
        })
            font: string,

        @SlashOption('free-font', {
            required: false,
            description: "Selecting a font from the full list. See `/text list-fonts`"
        })
            freeFont: string,

        interaction: CommandInteraction
    ) {
        if (font === undefined) {
            font = freeFont;
        }

        const asciiText = await this.convertToAscii(text, font);
        await interaction.reply(this.getCodeBlockWith(asciiText))
    }

    @Slash('list-fonts')
    async listFonts(interaction: CommandInteraction) {
        if (this.fonts) {
            const resolvedFonts = (await this.fonts).split('\n');
            const listBuilder = new ListMessageBuilder(resolvedFonts, 1)
            const options = listBuilder.build()
            console.log(options)
            await interaction.reply(options)
        } else {
            throw Error('fonts missing')
        }
    }

    @ButtonComponent('next')
    async next(interaction: ButtonInteraction) {
        const footer = interaction.message.embeds[0].footer

        if (footer && this.fonts) {
            const pageNo = await TextCommand.getNextPage(footer)
            const resolvedFonts = (await this.fonts).split('\n');


            const builder = new ListMessageBuilder(
                resolvedFonts,
                pageNo
            )

            await interaction.update(builder.build())
        } else {
            throw new Error('last message or fonts not found')
        }
    }

    @ButtonComponent('prev')
    async prev(interaction: ButtonInteraction) {
        const footer = interaction.message.embeds[0].footer

        if (footer && this.fonts) {
            const pageNo = await TextCommand.getPrevPage(footer)
            const resolvedFonts = (await this.fonts).split('\n');

            const builder = new ListMessageBuilder(
                resolvedFonts,
                pageNo
            )

            await interaction.update(builder.build())
        } else {
            throw new Error('last message or fonts not found')
        }
    }


    private static async getNextPage(footer: MessageEmbedFooter) {
        return TextCommand.getPageNo(footer, +1)
    }

    private static async getPrevPage(footer: MessageEmbedFooter) {
        return TextCommand.getPageNo(footer, -1)
    }

    private static async getPageNo(footer: MessageEmbedFooter, summand: number) {
        const pageNoString = footer.text.split(' ')[1];
        const currentPageNo = pageNoString.split('/')[0]
        const maxPageNo = pageNoString.split('/')[1]


        return Math.max(
            Math.min(
                parseInt(currentPageNo) + summand,
                parseInt(maxPageNo),
            ),
            1
        );
    }

    getCodeBlockWith(text: string) {
        let textBuilder = ''
        textBuilder += '```\n'
        textBuilder += text
        textBuilder += '\n```'

        return textBuilder
    }

    async convertToAscii(text: string, font: string | undefined): Promise<string> {
        return new Promise((resolve, reject) => {
            const options: figlet.Options = this.getFigletOptions(font)

            figlet(text, options, (err, text) => {
                if (err) {
                    reject(err)
                } else {
                    if (text) {
                        resolve(text)
                    } else {
                        reject('output text is undefined')
                    }
                }
            })
        })
    }

    getFigletOptions(font: string | undefined): figlet.Options {
        const fontType: figlet.Fonts = font as figlet.Fonts

        if (font) {
            return {
                font: fontType
            }
        } else {
            return {}
        }
    }

    @Once("ready")
    async readFonts(): Promise<void> {
        this.fonts = fs.promises.readFile(
            `${process.cwd() + this.fontFileLocation}`,
            'utf-8'
        );
    }

}
