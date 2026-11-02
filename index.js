const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  PermissionsBitField
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

const TOKEN =
  process.env.DISCORD_TOKEN ||
  process.env.DISCORD_BOT_TOKEN ||
  process.env.BOT_TOKEN ||
  process.env.TOKEN;

const SUPPORT_CHANNEL_ID = process.env.SUPPORT_CHANNEL_ID;
const STAFF_ROLE_ID = process.env.STAFF_ROLE_ID;

client.once("ready", () => {
  console.log(`SYNERA FA SUPPORT connecté : ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Messages privés des joueurs
  if (!message.guild) {
    try {
      const channel = await client.channels.fetch(SUPPORT_CHANNEL_ID);

      if (!channel) {
        throw new Error("Salon support introuvable.");
      }

      const embed = new EmbedBuilder()
        .setColor("#5865F2")
        .setTitle("Nouvelle demande de support")
        .setDescription(message.content || "Message sans texte")
        .addFields(
          { name: "Joueur", value: message.author.tag },
          { name: "ID du joueur", value: message.author.id }
        )
        .setTimestamp();

      await channel.send({ embeds: [embed] });

      await message.reply(
        "✅ Votre demande a bien été transmise à l'équipe SYNERA FA. Un membre du staff vous répondra prochainement."
      );
    } catch (error) {
      console.error("Erreur réception MP :", error);
      await message.reply(
        "❌ Une erreur est survenue. Merci de réessayer plus tard."
      );
    }

    return;
  }

  // Réponses du staff
  if (message.channel.id !== SUPPORT_CHANNEL_ID) return;

  const isAdmin = message.member.permissions.has(
    PermissionsBitField.Flags.Administrator
  );

  const isStaff = message.member.roles.cache.has(STAFF_ROLE_ID);

  if (!isAdmin && !isStaff) return;

  if (!message.content.startsWith("!reply ")) return;

  const args = message.content.slice(7).trim();
  const firstSpace = args.indexOf(" ");

  if (firstSpace === -1) {
    return message.reply(
      "Utilisation : !reply ID_DU_JOUEUR votre message"
    );
  }

  const userId = args.slice(0, firstSpace);
  const replyText = args.slice(firstSpace + 1);

  try {
    const user = await client.users.fetch(userId);

    await user.send({
      embeds: [
        new EmbedBuilder()
          .setColor("#57F287")
          .setTitle("Réponse du support SYNERA FA")
          .setDescription(replyText)
          .setFooter({ text: "Équipe support SYNERA FA" })
          .setTimestamp()
      ]
    });

    await message.reply("✅ Votre réponse a été envoyée au joueur.");
  } catch (error) {
    console.error(error);
    await message.reply("❌ Impossible d'envoyer le MP au joueur.");
  }
});

if (!TOKEN || !SUPPORT_CHANNEL_ID || !STAFF_ROLE_ID) {
  throw new Error("Configuration manquante dans les variables d'environnement.");
}

client.login(TOKEN);
