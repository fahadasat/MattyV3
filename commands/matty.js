/*
This command will send you a picture of matty
*/

module.exports = {
  name: "matty",
  aliases: ["whoismatty"],
  description: "Who really is Matty.",
  //   argumentDescription: "",
  // roles: ["Admin", "Mod", "Student"],
  args: false,
  //   usage: "",
  guildOnly: false,
  cooldown: 5,
  category: "Misc",
  execute(message, args) {
    message.reply({
      files: ["./files/matty.jpg"],
    });
  },
};
