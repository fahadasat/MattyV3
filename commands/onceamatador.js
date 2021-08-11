/*
This command will send always a matador
*/

module.exports = {
  name: "onceamatador",
  aliases: ["oam"],
  description: "Once a Matador!",
  //   argumentDescription: "",
  // roles: ["Admin", "Mod", "Student"],
  args: false,
  //   usage: "",
  guildOnly: false,
  cooldown: 5,
  category: "Misc",
  execute(message, args) {
    message.reply("Always a Matador!");
  },
};
