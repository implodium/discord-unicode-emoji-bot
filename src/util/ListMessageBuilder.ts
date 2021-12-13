import {InteractionReplyOptions, MessageActionRow, MessageButton, MessageEmbed} from "discord.js";

export default class ListMessageBuilder {

    private readonly pages: string[][] = []

    constructor(private fonts: string[], private pageNo: number) {
        this.pages = this.getPages();
    }

    build(): InteractionReplyOptions {
        const messageEmbed = this.buildPage()
        const actionRow = ListMessageBuilder.buildActionRow()

        return {
            embeds: [messageEmbed],
            components: [actionRow]
        }
    }

    private buildPage(): MessageEmbed {
        const messageEmbed = new MessageEmbed()
            .setTitle("Fonts")
            .setFooter(`Page ${this.pageNo}`)

        const fontPage = this.pages[this.pageNo];
        let description = ''

        for (const font of fontPage) {
            description += font + '\n'
        }

        return messageEmbed
            .setDescription(description);
    }


    private static buildActionRow() {
        const nextButton = new MessageButton()
            .setLabel('next')
            .setEmoji('⏭️')
            .setStyle('PRIMARY')
            .setCustomId('next')

        const previousButton = new MessageButton()
            .setLabel('previous')
            .setEmoji('⏮️')
            .setStyle('PRIMARY')
            .setCustomId('prev')

        return new MessageActionRow()
            .addComponents(previousButton, nextButton)
    }

    private getPages(): string[][] {
        let count = 0;
        const pages: string[][] = []
        console.log(this.fonts.length)

        while (count < this.fonts.length - 1) {
            const fontPage = this.fonts
                .slice(
                    count,
                    Math.min(count + 25, this.fonts.length - 1)
                )

            pages.push(fontPage)
            count += 25
        }

        return pages
    }
}
