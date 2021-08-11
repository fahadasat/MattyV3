const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");
const dbObjects = require("./db/dbObjects");
const dbFunction = require("./db/dbFunction");

const mongo = require("./mongo");
const userDtlsSchema = require("./schemas/userDtlsSchema");
const messageCounter = require("./db/messageCounter");

const schedule = require("node-schedule");

/*
TODO:
  change how to reset messages
  reset the monthky time/messages in the js array
  create schedule to save to database
*/

//create a collection to store all the commands
client.commands = new Discord.Collection();

//create a collection for all command names with key = command name, data = new Collection
//the new Collection has a key = user, data = time last used
const cooldown = new Discord.Collection();

//read all the js names in the /commands folder and insert them into an array
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

//go through the array of file names and insert them into the collection with the command name as the key
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  //search for the file using the command name as a key which is received by the user
  client.commands.set(command.name, command);
}

//command handler
client.on("message", (message) => {
  //first checks the prefix and if the messenger isnt a bot
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  //remove the prefix and send the command into an array
  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  //check if the command is in the collection or if the input is equal to any of the aliases
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      //first check if there is an alias array then check its contents
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  //if there is no such command return
  if (!command) return;

  //check if the command has been used before
  //if not create a new collection for it
  if (!cooldown.has(command.name)) {
    cooldown.set(command.name, new Discord.Collection());
  }

  //retreive the current time to compare it later
  //get the timestamp collection from the data
  //get the command cooldown or set the default cooldown to 3 seconds
  const now = Date.now();
  const timestamps = cooldown.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    //get the time that the cooldown will be expired
    const expirationTime = cooldownAmount + timestamps.get(message.author.id);

    //compare if the cooldown is expired or not
    //if it isnt reply with the time left before command is useable
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      setTimeout(() => message.delete(), 1000);
      return message
        .reply(
          `You need to wait ${timeLeft.toFixed(1)} 
        more second(s) before reusing the \`${command.name}\` command.`
        )
        .then((msg) => {
          msg.delete({ timeout: 5000 });
        });
    }
  }

  //if the user hasnt used the command recently add them into the collection
  //after the required cooldown amount delete the user from the collection
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    //check for guild-only commands
    if (command.guildOnly && message.channel.type === "dm") {
      return message.reply("I can't execute that command inside DMs!");
    }

    //check for permissions
    if (command.roles) {
      if (
        !message.member.roles.cache.find((r) => command.roles.includes(r.name))
      ) {
        return message.reply("Don't have the required permissions.");
      }
    }

    //check if user provided correct arguments
    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}!`;

      //reply with the correct command usage
      if (command.usage) {
        reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``;
      }
      return message.channel.send(reply);
    }

    //execute the command if correct arguments are given
    command.execute(message, args);
  } catch (err) {
    console.error(err);
    message.reply("There was an error in executing the command.");
  }
});

//events

//when a new member joins give them answer the bot role
client.on("guildMemberAdd", (member) => {
  client.channels.cache
    .get("496834947894476810")
    .send(`Welcome ${member.user}!`);
  client.channels.cache.get("496834947894476810").send(
    `Please follow the format and answer the following:
    Major
    Class standing (by units)
    Commute or Dorm \n` + `to get access to the rest of the channels.`
  );

  member.roles.add(
    member.guild.roles.cache.find((role) => role.name === "AnswerTheBot")
  );
});

client.once("ready", async () => {
  //set the status
  client.user
    .setActivity("with discord.js documentation", { type: "PLAYING" })
    .then(console.log(client.user.username));

  await mongo().then(async (mongoose) => {
    dbObjects.mongoo = mongoose;
  });

  //load database to array
  dbFunction.loadData();

  //import and activate db files
  messageCounter(client);
});

//reset this months messages and voice
//lets hope it works ¯\_(ツ)_/¯
schedule.scheduleJob("0 0 1 * *", async function () {
  try {
    await userDtlsSchema.updateMany({}, { avgMessage: 0 }).exec();
    await userDtlsSchema.updateMany({}, { avgVC: 0 }).exec();
    dbObjects.userDtls.forEach((element) => {
      element.avgVc = 0;
      element.avgMessage = 0;
    });
  } catch (err) {
    console.log(`error resetting data in index.js ${err}`);
  }
});

//https://stackoverflow.com/questions/36979146/is-a-connection-to-mongodb-automatically-closed-on-process-exit
// This will handle process.exit():
process.on("exit", () => {
  dbObjects.mongoo.connection.close().then(() => {
    console.log("MongoDb connection closed.");
    process.exit();
  });
});

// This will handle kill commands, such as CTRL+C:
process.on("SIGINT", () => {
  dbObjects.mongoo.connection.close().then(() => {
    console.log("MongoDb connection closed.");
    process.exit();
  });
});
process.on("SIGTERM", () => {
  dbObjects.mongoo.connection.close().then(() => {
    console.log("MongoDb connection closed.");
    process.exit();
  });
});

//doesnt work on newer node versions
//this isnt even called in windows
//but gives errors in linux
// process.on("SIGKILL", () => {
//   dbObjects.mongoo.connection.close().then(() => {
//     console.log("MongoDb connection closed.");
//     process.exit();
//   });
// });

// This will prevent dirty exit on code-fault crashes:
process.on("uncaughtException", () => {
  dbObjects.mongoo.connection.close().then(() => {
    console.log("MongoDb connection closed.");
    process.exit();
  });
});

//start the bot with the token from the config file
client.login(config.token);
