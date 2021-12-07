import {Discord, Slash, SlashGroup} from "discordx";
import {CommandInteraction} from "discord.js";

@Discord()
@SlashGroup('emoji', 'prints out unicode emojis')
export default abstract class UnicodeCommandCollection {

    @Slash('help')
    async help(interaction: CommandInteraction) {
        await interaction.reply('With this command you can express yourself with ascii emojis')
    }

    @Slash('angry', {description: 'angry emoji'})
    async angry(interaction: CommandInteraction) {
        await interaction.reply("(　ﾟДﾟ)＜!!")
    }

    @Slash('happy', {description: 'happy emoji'})
    async happy(interaction: CommandInteraction) {
        await interaction.reply("ʘ‿ʘ")
    }

    @Slash('happy-dog-look', {description: 'Happy Dog Look emoji'})
    async happyDogLook(interaction: CommandInteraction) {
        await interaction.reply("(ᵔᴥᵔ)")
    }

    @Slash('nyan-cat', {description: 'Nyan Cat emoji'})
    async nyanCat(interaction: CommandInteraction) {
        await interaction.reply("≋≋≋≋≋̯̫⌧̯̫(ˆ•̮ ̮•ˆ) ")
    }

}
