/*
This command will send a list of all maps if there isn't an argument
If there is an argument it will send the desired map picture
*/
const Discord = require("discord.js");
module.exports = {
  name: "maps",
  aliases: ["m", "map"],
  description: "Sends you various school maps.",
  argumentDescription:
    "Give an argument for a map picture or leave it blank to get all commands.",
  // roles: ["Admin", "Mod", "Student"],
  args: false,
  usage: "[campus]",
  guildOnly: false,
  cooldown: 5,
  category: "Info",
  execute(message, args) {
    if (!args.length) {
      const mapsEmbed = new Discord.MessageEmbed()
        .setTitle("Map Arguments:")
        .setColor("#ff4242")
        .addFields(
          { name: "campus", value: "The campus map" },
          { name: "housing", value: "The housing map" },
          { name: "shuttle", value: "The shuttle map" },
          { name: "water", value: "The water map" },
          { name: "lactation", value: "The lactation map" }
        );
      return message.reply(mapsEmbed);
    }
    switch (args[0]) {
      case "campus":
        message.channel.send({
          files: ["./files/maps/campusmap.jpg"],
        });
        break;
      case "housing":
        message.channel.send({
          files: ["./files/maps/housingmap.png"],
        });
        break;
      case "shuttle":
        message.channel.send({
          files: ["./files/maps/shuttlemap.png"],
        });
        break;
      case "water":
        message.channel.send({
          files: ["./files/maps/watermap.jpg"],
        });
        break;
      case "lactation":
        message.channel.send({
          files: ["./files/maps/lactationmap.jpg"],
        });
        break;
    }
  },
};
