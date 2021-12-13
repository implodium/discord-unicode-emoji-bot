import {Discord, Slash, SlashChoice, SlashGroup, SlashOption} from "discordx";
import {CommandInteraction} from "discord.js";
import figlet from 'figlet'


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
            description: "Selecting a font from the full list. See `list-fonts`"
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

}