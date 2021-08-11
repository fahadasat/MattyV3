/*
This command will either send a list of commands through dms if no arguments are used
or this command will send the details for a specific command
*/

/*
TODO: remember to make sure the message works if the embed is too large
*/
const { prefix } = require("../config.json");
const Discord = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["botinfo", "info", "commands"],
  description: "List all commands for this bot.",
  argumentDescription: "Either give a command to search or keep it clear.",
  //dm commands cant have roles associated with them
  // roles: ["Admin", "Mod", "Student"],
  args: false,
  usage: "[command name]",
  guildOnly: false,
  cooldown: 10,
  category: "Info",
  execute(message, args) {
    const infoEmbed = new Discord.MessageEmbed()
      .setAuthor(
        "MattyBot",
        "https://lh3.googleusercontent.com/c1kzQmsGiCyTGUjs97gwCW2e-Daxx2jtlN5j_iFqaRmde3NiUH7c_p8QCOZ88BXlKrI",
        "https://www.csun.edu/"
      )
      .setColor(0x8942f4)
      .setFooter("© To serve the Matadors!")
      .setThumbnail(
        "https://s1.ticketm.net/tm/en-us/dam/a/4ff/403d3d47-7f19-495a-af68-f271bcae64ff_246081_CUSTOM.jpg"
      );

    //need the command collection to retreive all the commands
    const { commands } = message.client;

    //if there are no arguments the bot will return a list of all current commands
    if (!args.length) {
      const categories = {
        info: "",
        fun: "",
        misc: "",
        utilities: "",
      };

      //check the command category and add it to its corresponding string
      commands.forEach((cmd) => {
        if (cmd.category === "Info") categories.info += `${cmd.name}, `;
        else if (cmd.category === "Fun") categories.fun += `${cmd.name}, `;
        else if (cmd.category === "Misc") categories.misc += `${cmd.name}, `;
        else if (cmd.category === "Utilities")
          categories.utilities += `${cmd.name}, `;
      });

      infoEmbed.setTitle("Main Commands:");
      infoEmbed.setDescription(
        `You can send \`${prefix}help [command name]\` to get info on a specific command!`
      );

      //add the fields in the embed
      infoEmbed.addFields(
        { name: "**Info Commands**", value: categories.info },
        { name: "**Fun Commands**", value: categories.fun },
        { name: "**Misc Commands**", value: categories.misc },
        { name: "**Utility Commands**", value: categories.utilities }
      );

      //dm the author all the commands
      return message.author
        .send(infoEmbed)
        .then(() => {
          if (message.channel.type === "dm") return;
          message.reply("I've sent you a DM with all my commands!");
        })
        .catch((error) => {
          console.error(
            `Could not send help DM to ${message.author.tag}.\n`,
            error
          );
          message.reply(
            "It seems like I can't DM you! Do you have DMs disabled?"
          );
        });
    }

    //if an argument is used then use the same method used in index.js to find the command from the collection
    const name = args[0].toLowerCase();
    const command =
      commands.get(name) ||
      commands.find((cmd) => cmd.aliases && cmd.aliases.includes(name));

    //if there is no command then return
    if (!command) {
      return message.reply("That wasn't a valid command.");
    }
    //if the property is optional ex: command.argumentDescription
    // then use if statements to push the data in the embed
    //else just add it normally, if the property is an array then join it first like aliases

    infoEmbed.setTitle("Command details:");
    infoEmbed.setDescription(
      `You can use \`${prefix}${command.name}\` to use the command!`
    );

    infoEmbed.addFields(
      { name: "**Name:**", value: `${command.name}` },
      { name: "**Aliases:**", value: `${command.aliases.join(", ")}` },
      { name: "**Description:**", value: `${command.description}` },
      // { name: "**Roles needed:**", value: `${command.roles.join(", ")}` },
      { name: "**Server Only:**", value: `${command.guildOnly}` },
      { name: "**Cooldown:**", value: `${command.cooldown || 3} second(s)` }
    );
    if (command.argumentDescription)
      infoEmbed.addField(
        "Argument description:",
        `${command.argumentDescription}`
      );

    if (command.roles)
      infoEmbed.addField("Roles:", `${command.roles.join(", ")}`);

    if (command.usage)
      infoEmbed.addField("Usage:", `${prefix}${command.name} ${command.usage}`);

    //reply to the author the command details
    return message.reply(infoEmbed).catch((error) => {
      console.error(`Could not send help to ${message.author.tag}.\n`, error);
      message.reply("It seems like I can't help you, sorry.");
    });
  },
};
