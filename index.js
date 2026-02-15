const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is alive!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Web server started!");
});
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  Events,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// 🔐 Command to setup verify message
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  if (message.content === "!verifysetup") {
    const embed = new EmbedBuilder()
      .setColor(0x00bfff)
      .setTitle("🔐 Server Verification")
      .setDescription("Click the button below to verify yourself!")
      .setFooter({ text: "Prime Developers 🚀" })
      .setTimestamp();

    const button = new ButtonBuilder()
      .setCustomId("verify_button")
      .setLabel("✅ Verify")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(button);

    await message.channel.send({
      embeds: [embed],
      components: [row],
    });
  }
});

// 🔘 Button interaction
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "verify_button") {
    const role = interaction.guild.roles.cache.find(
      (r) => r.name === "〤 | Verified 」ッ",
    );

    if (!role) {
      return interaction.reply({
        content: "❌ Verified role not found! Create a role named 'Verified'.",
        ephemeral: true,
      });
    }

    // ⚠️ Already verified check
    if (interaction.member.roles.cache.has(role.id)) {
      return interaction.reply({
        content: "⚠️ You're already verified!",
        ephemeral: true,
      });
    }

    // ✅ Give role
    await interaction.member.roles.add(role);

    await interaction.reply({
      content: "✅ You are now verified!",
      ephemeral: true,
    });
  }
});

client.login(process.env.TOKEN);
