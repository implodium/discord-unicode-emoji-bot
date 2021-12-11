import {Discord, Slash, SlashChoice, SlashOption} from "discordx";
import {CommandInteraction} from "discord.js";
import figlet from 'figlet'


enum Fonts {
    "1Row" = "1Row",
    "3-D" = "3-D",
    "3D Diagonal" = "3D Diagonal",
    "3D-ASCII" = "3D-ASCII",
    "3x5" = "3x5",
    "4Max" = "4Max",
    "5 Line Oblique" = "5 Line Oblique",
    "AMC 3 Line" = "AMC 3 Line",
    "AMC 3 Liv1" = "AMC 3 Liv1",
    "AMC AAA01" = "AMC AAA01",
    "AMC Neko" = "AMC Neko",
    "AMC Razor" = "AMC Razor",
    "AMC Razor2" = "AMC Razor2",
    "AMC Slash" = "AMC Slash",
    "AMC Slider" = "AMC Slider",
    "AMC Thin" = "AMC Thin",
    "AMC Tubes" = "AMC Tubes",
    "AMC Untitled" = "AMC Untitled",
    "ANSI Regular" = "ANSI Regular",
    "ANSI Shadow" = "ANSI Shadow",
    "ASCII New Roman" = "ASCII New Roman",
    "Acrobatic" = "Acrobatic",
    "Alligator" = "Alligator",
    "Alligator2" = "Alligator2",
    "Alpha" = "Alpha",
}

@Discord()
export default class TextCommand {

    @Slash('text', {description: 'sends text in ascii format'})
    async sendText(

        @SlashOption('text', {required: true})
        text: string,

        @SlashChoice(Fonts)
        @SlashOption('font', {required: false})
        font: string,

        interaction: CommandInteraction
    ) {
        console.log(font)
        let textBuilder = ''
        textBuilder += '```\n'
        textBuilder += await this.convertToAscii(text, font)
        textBuilder += '\n```'
        await interaction.reply(textBuilder)
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
