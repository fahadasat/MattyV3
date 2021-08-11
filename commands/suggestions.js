/*
This command will send the suggestion to the mod channel
*/

module.exports = {
  name: "suggestions",
  aliases: ["suggest", "please", "suggestion", "complaint", "complain"],
  description: "Sends a suggestion to the mod team.",
  argumentDescription: "The suggestion you want to send",
  roles: ["Admin", "Mod", "Student"],
  args: true,
  usage: "[suggestion]",
  guildOnly: true,
  cooldown: 0.1,
  category: "Misc",
  execute(message, args) {
    message.reply(
      "Your suggestion/complaint has been forwarded to the mod team."
    );
    message.client.channels.cache
      .get("739198184857010176")
      .send(
        `Here is a suggestion by: <@${message.author.id}> \`\`${args.join(
          " "
        )}\`\``
      );
  },
};
