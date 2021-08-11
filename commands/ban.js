/*
This command will ban the mentioned user with a reason
*/

module.exports = {
  name: "ban",
  aliases: ["remove", "delete"],
  description: "Bans someone.",
  argumentDescription: "Give a reason and someone that needs to be banned.",
  roles: ["Admin", "Mod"],
  args: true,
  usage: "[@user] [reason]",
  guildOnly: true,
  cooldown: 10,
  category: "Utilities",
  execute(message, args) {
    //get the reason for the ban
    let cause = args
      .join(" ")
      .replace(`<@!${message.mentions.users.first().id}>`, "");

    let member = message.mentions.users.first();

    if (member) {
      // this gets the member from the user
      const user = message.guild.member(member);
      if (user) {
        user
          .ban({ reason: cause })
          .then(() => {
            message.reply("Successfully banned.");
          })
          .catch((err) => {
            console.log(`error banning someone ${err}`);
            message.reply(
              `I do not have permissions to ban  ${message.mentions.users.first()}`
            );
          });
      }
    }
  },
};
