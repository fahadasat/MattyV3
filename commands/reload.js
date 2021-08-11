/*
This command will reload the file for a single command. helpful for testing purposes
*/

module.exports = {
  name: "reload",
  aliases: ["restart", "reboot", "reset"],
  description: "Used to reload a command.",
  argumentDescription: "The argument needs to be a bot command.",
  roles: ["Admin", "Mod"],
  args: true,
  usage: "[command name]",
  guildOnly: true,
  cooldown: 10,
  category: "Utilities",
  execute(message, args) {
    const commandName = args[0].toLowerCase();

    //retrive the command from the name or the aliases
    const command =
      message.client.commands.get(commandName) ||
      message.client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    //command is null then return
    if (!command)
      return message.channel.send(
        `There is no command with name or alias \`${commandName}\`, ${message.author}!`
      );

    //first you need to delete the cache of the file then replace it from the collection
    //if you remove it from the collection and re-add it without deleting the cache of it then
    //the file won't change
    delete require.cache[require.resolve(`./${command.name}.js`)];

    //always use try/catch when dealing with files
    //after finding the file replace the old command in the Collection
    //replacing is safer then deleting/adding
    try {
      const newCommand = require(`./${command.name}.js`);
      message.client.commands.set(newCommand.name, newCommand);
    } catch (error) {
      console.error(error);
      message.channel.send(
        `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``
      );
    }
    message.channel.send(`Command \`${command.name}\` was reloaded!`);
  },
};
