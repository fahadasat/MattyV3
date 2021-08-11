/*
Challlenge another server member to a connect four game
*/
const Discord = require("discord.js");
let Connect = require("connect-four");

let currentGames = [];
let challengerWaitingRoom = [];

module.exports = {
  name: "connect-four",
  aliases: ["c4", "connect4", "cfour", "connect"],
  description: "Challenge another person to a game of connect four.",
  argumentDescription: "Sub commands for the connect four game.",
  roles: ["Admin", "Mod", "Student"],
  args: false,
  usage: "[connect-four]",
  guildOnly: true,
  cooldown: 2,
  category: "Fun",
  execute(message, args) {
    if (!args.length) {
      //print all the commands if there isn't any arguments
      const connectEmbed = new Discord.MessageEmbed()
        .setTitle("Connect-4 Arguments:")
        .setColor("#ff4242")
        .addFields(
          { name: "challenge [@player]", value: "The campus map" },
          {
            name: "place [number 1-7]",
            value: "Place your chip/token in the desired column.",
          },
          {
            name: "resign",
            value: "/ff my team sucks.",
          },
          {
            name: "draw",
            value: "Ask for a draw.",
          }
        );
      return message.reply(connectEmbed);
    }
    switch (args[0]) {
      case "challenge":
        //get the person that was challenged
        let challengee = message.guild.member(message.mentions.users.first());
        //check if that person is a valid user
        if (!challengee) return message.reply("That wasn't a valid user.");
        //make sure they aren't challenging themselves
        if (challengee.id === message.author.id)
          return message.reply("You can't challenge yourself.");
        //make sure both players aren't currently in a game
        if (inGame(message.member) || inGame(challengee))
          return message.reply("One of you is already in a game.");
        //check if the person already challenged someone else
        if (challengerWaitingRoom.indexOf(message.member) > -1)
          return message.reply("You already challenged someone.");
        //if all the checks come out false then enter them into the challenger waiting room
        challengerWaitingRoom.push(message.member);
        message.channel.send(
          `${message.member} has challenged you to a connect-4 battle please say accept or decline. ${challengee.user}`
        );
        //filter and wait for the challengee's messages and check if they accept or decline
        //this will only wait for 1 message and only for 20 seconds
        const filter = (m) => challengee.id === m.author.id;
        message.channel
          .awaitMessages(filter, {
            time: 20000,
            max: 1,
            errors: ["time"],
          })
          .then((messages) => {
            //when the person replies then remove the challenger from the waiting room
            let challengerIndex = challengerWaitingRoom.indexOf(message.member);
            challengerWaitingRoom.splice(challengerIndex, 1);
            //randomize who starts first
            let starting;
            if (Math.floor(Math.random() * 2) === 0)
              starting = message.member.id;
            else starting = challengee.id;
            //if the challengee accepts, then create a new game object with the api
            //with the date being the game id and push it into the list of current games
            if (messages.first().content.toLowerCase() === "accept") {
              let game = new Connect();
              let gameId = Date.now();
              currentGames.push({
                id: gameId,
                players: [message.member, challengee],
                turn: starting,
                board: game,
                resign: [],
                gamePicture: null,
              });
              //game ends after 10 minutes
              setTimeout(function () {
                forceGameEnd(gameId, message);
              }, 10 * 60 * 1000);
              message.channel.send(
                `${message.member}, ${challengee.user} has accepted your challenge. <@${starting}> goes first.\nUse ~c4 place [1 - 7] To place your token.\nYour game will automatically end after 10 minutes.`
              );
              return message.channel
                .send(printGame(currentGames.length - 1))
                .then((msg) => {
                  currentGames[currentGames.length - 1].gamePicture = msg;
                });
              //if the challengee declined the challenge or doesn't respond
              //then remove the challenger from the waiting room
            } else if (messages.first().content.toLowerCase() === "decline")
              return message.reply(
                `${challengee.user} declined your challenge.`
              );
            else
              return message.reply(
                `${challengee.user} did not respond to your challenge.`
              );
          })
          .catch((err) => {
            console.log(err);
            let challengerIndex = challengerWaitingRoom.indexOf(message.member);
            challengerWaitingRoom.splice(challengerIndex, 1);
            return message.reply(
              `${challengee.user} did not respond to your challenge.`
            );
          });
        break;
      case "place":
        //check if the person is in a game
        if (!inGame(message.member))
          return message.reply("You need to be in a game first.");
        message.delete({ timeout: 5000 });
        //get the index of the persons game
        let index = gameIndex(message.member);

        //check if its the persons move first
        if (currentGames[index].turn !== message.member.id)
          return message.reply("It's not your turn.");
        try {
          //if the move is valid take the argument and subtract by one so its fits the requirements of 0-6 not 1-7
          //then place the move on the board
          if (
            currentGames[index].board.validMove(parseInt(args[1].trim() - 1))
          ) {
            currentGames[index].board.play(
              message.member.id,
              parseInt(args[1].trim() - 1)
            );
            currentGames[index].gamePicture
              .edit(printGame(index))
              .then((msg) => {
                currentGames[index].gamePicture = msg;
              });
            //if the next move is played then the player doesn't want to resign
            //so clear out the resign array
            currentGames[index].resign.pop();
            //check if the game has ended after the palyer has made their move
            if (currentGames[index].board.ended) {
              //if the game ends and there is no winner then there was a tie
              if (currentGames[index].board.winner == null)
                message.channel.send(
                  `Well fought, ${currentGames[index].players[0]} and ${currentGames[index].players[1]}. The game ends with a tie.`
                );
              //else print the winner
              else
                message.channel.send(
                  `<@${currentGames[index].board.winner}> has won.`
                );
              //remove the game after the game has ended
              removeGame(currentGames[index].id);
              return;
            }

            //switch to the next turn
            if (
              currentGames[index].turn ===
              currentGames[index].players[0].user.id
            )
              currentGames[index].turn = currentGames[index].players[1].user.id;
            else
              currentGames[index].turn = currentGames[index].players[0].user.id;
            message.channel
              .send(`<@${currentGames[index].turn}> it's your turn.`)
              .then((msg) => {
                msg.delete({ timeout: 5000 });
              });
          } else return message.reply("Invalid move.");
        } catch (err) {
          console.log(err);
          return message.reply("Invalid move.");
        }
        break;
      case "resign":
        //check if the person is in a game
        if (!inGame(message.member))
          return message.reply("You need to be in a game first.");
        //get the game index
        let game = gameIndex(message.member);
        let loserIndex = currentGames[game].players.findIndex(
          (player) => player.user.id === message.member.id
        );
        //declare the other person in the game the winner
        let temp = currentGames[game].players.slice();
        let loser = temp.splice(loserIndex, 1);
        let winner = temp[0];

        message.channel.send(
          `${loser[0].user} couldn't handle what ${winner.user} was putting down and surrendered.`
        );
        //move the game after the person has resigned
        removeGame(currentGames[game].id);
        break;
      case "draw":
        //check if the person is in a game
        if (!inGame(message.member))
          return message.reply("You need to be in a game first.");
        //get the game index of the player
        let position = gameIndex(message.member);
        //check if the resign array is empty, if it is then this person is the one initiating the draw
        //to ask for a resign. if it has length then they are accepting the draw not initiating
        if (!currentGames[position].resign.length) {
          currentGames[position].resign.push(message.member);
          let playerOneIndex = currentGames[position].players.findIndex(
            (player) => player.user.id === message.member.id
          );
          let temp = currentGames[position].players.slice();
          let playerOne = temp.splice(playerOneIndex, 1);
          let playerTwo = temp[0];
          return message.channel.send(
            `${playerOne[0].user} sent a draw. ${playerTwo.user} please use ~c4 draw to accept or place your token to playing to continue.`
          );
        }
        message.channel.send(
          `${currentGames[position].players[0]} and ${currentGames[position].players[1]}'s game as ended in a draw.`
        );
        //remove the game if the draw was accepted
        removeGame(currentGames[position].id);
        break;
    }
  },
};

//get the players array in the currentGames array if the challenger or challengee is currently in a game
function inGame(player) {
  for (let i = 0; i < currentGames.length; i++) {
    if (currentGames[i].players.indexOf(player) > -1) return true;
  }
  return false;
}

//get the game index of the player
function gameIndex(player) {
  let index;
  for (let i = 0; i < currentGames.length; i++) {
    if (currentGames[i].players.indexOf(player) > -1) {
      index = i;
      break;
    }
  }
  return index;
}

//force the end of a game after 10 minutes
function forceGameEnd(gameId, message) {
  let index = currentGames.findIndex((game) => game.id === gameId);
  if (index < 0) return;
  if (currentGames[index].board.ended) return;
  let loserIndex = currentGames[index].players.findIndex(
    (player) => player.user.id === currentGames[index].turn
  );
  let temp = currentGames[index].players.slice();
  let loser = temp.splice(loserIndex, 1);
  let winner = temp[0];

  message.channel.send(
    `Due to time ${winner.user} has won and ${loser[0].user} has lost.`
  );
  removeGame(gameId);
}

// remove game from the array so the users can start a new one
function removeGame(gameId) {
  let index = currentGames.findIndex((game) => game.id === gameId);
  if (index > -1) currentGames.splice(index, 1);
}

//double for loop to print out the 2d array
function printGame(index) {
  let string = `**${currentGames[index].players[0]}: 🔴 VS ${currentGames[index].players[1]}: 🔵 **\n---------------------------------\n`;

  for (let i = 5; i > -1; i--) {
    string += "| ";
    for (let j = 0; j < 7; j++) {
      if (
        currentGames[index].board.get(j, i) ===
        currentGames[index].players[0].id
      )
        string += "🔴 ";
      else if (
        currentGames[index].board.get(j, i) ===
        currentGames[index].players[1].id
      )
        string += "🔵 ";
      else string += "⚫ ";
    }
    string += " |\n";
  }
  string += "---------------------------------";
  return string;
}
