/*
This command will kick the mentioned user with a reason
*/

module.exports = {
  name: "kick",
  aliases: ["boot"],
  description: "Kicks someone.",
  argumentDescription: "Give a reason and someone that needs to be kicked.",
  roles: ["Admin", "Mod"],
  args: true,
  usage: "[@user] [reason]",
  guildOnly: true,
  cooldown: 5,
  category: "Utilities",
  execute(message, args) {
    //get the reason for the kick
    let reason = args
      .join(" ")
      .replace(`<@!${message.mentions.users.first().id}>`, "");

    let member = message.mentions.users.first();

    if (member) {
      // this gets the member from the user
      const user = message.guild.member(member);
      if (user) {
        user
          .kick(reason)
          .then(() => {
            message.reply("Successfully kicked.");
          })
          .catch((err) => {
            console.log(`error kicking someone ${err}`);
            message.reply(
              `I do not have permissions to kick ${message.mentions.users.first()}`
            );
          });
      }
    }
  },
};
