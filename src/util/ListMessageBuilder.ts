import {InteractionReplyOptions, MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import PageList from "../model/PageList";

export default class ListMessageBuilder {

    constructor(private pageList: PageList) {
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
        const description = this.pageList.pageContent

        return new MessageEmbed()
            .setTitle("Fonts")
            .setDescription(description)
            .setFooter(`Page ${this.pageList.pageNo}/${this.pageList.length - 1}`)
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
}
