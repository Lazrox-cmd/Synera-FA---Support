  if (firstSpace === -1) {
      return message.reply("Utilisation : !reply ID_DU_JOUEUR votre message");
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
  }
});

if (!TOKEN || !SUPPORT_CHANNEL_ID || !STAFF_ROLE_ID) {
  throw new Error("Configuration manquante dans les variables d'environnement.");
}

client.login(TOKEN);
