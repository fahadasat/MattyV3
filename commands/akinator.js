/*
This command will allow you to play an akinator game
*/
const { Aki } = require("aki-api");
const Discord = require("discord.js");

const region = "en";
let akiGames = [];

module.exports = {
  name: "akinator",
  aliases: ["ak"],
  description: "Akinator will guess what your thinking.",
  //   argumentDescription: "Use start t",
  // roles: ["Admin", "Mod", "Student"],
  args: false,
  //   usage: "start", answers: [Yes, No, Don't know, Probably, Probably not]
  guildOnly: false,
  cooldown: 2,
  category: "Fun",
  async execute(message, args) {
    //check if user already has a akinator game going
    if (akiGames.findIndex((object) => object.player === message.author) > -1)
      return message.reply("You are already in a game with Akinator.");

    //create an object to hold the user player, the akinator game instance, and the embed message
    let user = message.author;
    let aki = new Aki(region);
    await aki.start();

    const gameEmbed = new Discord.MessageEmbed()
      .setColor("#ff4242")
      .setTitle(`${user.username}'s Akinator Game`)
      .addFields({
        name: aki.question,
        value: "1) Yes\n2) No\n3) Don't Know\n4) Probably\n5) Probably Not",
      });

    //send the embed message then push the object into the array and use the function nextStep to wait for a response
    message.channel
      .send(gameEmbed)
      .then((sentMessage) => {
        akiGames.push({
          player: user,
          game: aki,
          embed: sentMessage,
        });
      })
      .then(() => {
        let index = akiGames.length - 1;
        this.nextStep(index);
      });
  },

  //first filter our and only check the next message sent by the person playing
  //the game ends when the user hasnt said the correct resposne of 1, 2, 3, 4, or 5
  //the game also ends with no response after 30 seconds
  nextStep: async function (index) {
    const filter = (m) => akiGames[index].player.id === m.author.id;
    akiGames[index].embed.channel
      .awaitMessages(filter, {
        time: 30000,
        max: 1,
        errors: ["time"],
      })
      .then(async (msg) => {
        //check the message and delete it so there is no spam
        if (msg.first().content === "1") {
          msg.first().delete();
          await akiGames[index].game.step(0);
        } else if (msg.first().content === "2") {
          msg.first().delete();
          await akiGames[index].game.step(1);
        } else if (msg.first().content === "3") {
          msg.first().delete();
          await akiGames[index].game.step(2);
        } else if (msg.first().content === "4") {
          msg.first().delete();
          await akiGames[index].game.step(3);
        } else if (msg.first().content === "5") {
          msg.first().delete();
          await akiGames[index].game.step(4);
        } else {
          akiGames[index].embed.channel.send(
            `<@${akiGames[index].player.id}>, you didn't not respond to Akinator, game is over.`
          );
          akiGames.splice(index, 1);
          return;
        }
        //the game ends when the probability of the person is greater than 80%
        //or when 79 questions have been asked
        if (
          akiGames[index].game.progress >= 80 ||
          akiGames[index].game.currentStep >= 78
        ) {
          //end the game and edit the embed to print out the name, the picture and how many questions it took
          //afterwards delete the game from the array
          await akiGames[index].game.win();
          const newGameEmbed = new Discord.MessageEmbed()
            .setColor("#ff4242")
            .setTitle(`${akiGames[index].player.username}'s Akinator Game`)
            .addFields({
              name: `You are thinking about ${akiGames[index].game.answers[0].name}`,
              value: `This took ${akiGames[index].game.currentStep} questions.`,
            })
            .setImage(akiGames[index].game.answers[0].absolute_picture_path);
          akiGames[index].embed.edit(newGameEmbed);
          akiGames.splice(index, 1);
        } else {
          //if the game hasnt ended edit the embed with the new question and recursively go back into this function
          const newGameEmbed = new Discord.MessageEmbed()
            .setColor("#ff4242")
            .setTitle(`${akiGames[index].player.username}'s Akinator Game`)
            .addFields(
              {
                name: akiGames[index].game.question,
                value:
                  "1) Yes\n2) No\n3) Don't Know\n4) Probably\n5) Probably Not",
              },
              {
                name: "Progress",
                value: akiGames[index].game.progress,
              }
            );
          akiGames[index].embed.edit(newGameEmbed).then((msg) => {
            akiGames[index].embed = msg;
          });
          this.nextStep(index);
        }
      })
      .catch((error) => {
        console.log(error);
        akiGames[index].embed.channel.send(
          `<@${akiGames[index].player.id}>, you didn't not respond to Akinator, game is over.`
        );
        akiGames.splice(index, 1);
        return;
      });
  },
};
