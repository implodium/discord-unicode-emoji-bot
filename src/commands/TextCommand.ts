import {ButtonComponent, Discord, Once, Slash, SlashChoice, SlashGroup, SlashOption} from "discordx";
import {ButtonInteraction, CommandInteraction, MessageEmbedFooter} from "discord.js";
import figlet from 'figlet'
import * as fs from "fs";
import ListMessageBuilder from "../util/ListMessageBuilder.js";
import PageList from "../model/PageList.js";
import Fonts from "./choices/Fonts.js";

@Discord()
@SlashGroup('text')
export default class TextCommand {

    private fontFileLocation = "/resources/fonts.txt"
    private fonts?: Promise<string>
    private pageSize = 50

    @Once("ready")
    async readFonts(): Promise<void> {
        this.fonts = fs.promises.readFile(
            `${process.cwd() + this.fontFileLocation}`,
            'utf-8'
        );
    }

    async resolveFonts() {
        if (this.fonts) {
            return await this.fonts
        } else {
            throw new Error('fonts not found. They may not have been initialized')
        }
    }


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


    getCodeBlockWith(text: string) {
        let textBuilder = ''
        textBuilder += '```\n'
        textBuilder += text
        textBuilder += '\n```'

        return textBuilder
    }

    @Slash('list-fonts')
    async listFonts(interaction: CommandInteraction) {
        const fonts = (await this.resolveFonts()).split('\n');
        const pageList = new PageList(fonts, this.pageSize)
        const messageBuilder = new ListMessageBuilder(pageList)

        const options = messageBuilder.build()
        await interaction.reply(options)
    }

    @ButtonComponent('next')
    async next(interaction: ButtonInteraction) {
        await this.changePage(interaction, +1)
    }

    @ButtonComponent('prev')
    async prev(interaction: ButtonInteraction) {
        await this.changePage(interaction, -1)
    }

    async changePage(interaction: ButtonInteraction, summand: number) {
        const footer = interaction.message.embeds[0].footer as MessageEmbedFooter
        const pageNo = TextCommand.getPageNoFrom(footer)
        const fonts = (await this.resolveFonts()).split('\n')
        const pageList = new PageList(fonts, this.pageSize, pageNo)

        pageList.changePage(summand)

        const builder = new ListMessageBuilder(
            pageList,
        )

        await interaction.update(builder.build())
    }

    private static getPageNoFrom(footer?: MessageEmbedFooter): number {
        if (footer) {
            const pageNoString = footer.text.split(' ')[1];
            const currentPageNoString = pageNoString
                .split('/')[0]

            return parseInt(currentPageNoString)
        } else {
            throw new Error('footer is undefined')
        }
    }
}
