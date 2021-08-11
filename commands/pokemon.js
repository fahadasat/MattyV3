/*
This command will 
*/


module.exports = {
  name: "pokemon",
  aliases: ["p", "poke"],
  description: "Used for Pokemon commands.",
  argumentDescription:
    "Give an argument for a Pokemon command or leave it blank to get all commands.",
  roles: ["Admin", "Mod", "Student"],
  args: false,
  usage: "[items]",
  guildOnly: true,
  cooldown: 5,
  category: "Fun",
  execute(message, args) {
    if (!args.length) {
      
    }
  },
};
