/*
This command list 10 movies in planned meetups
remove a chosen movie from the database
add to the vote list
remove from the vote list 
and give the imdb result
*/

const Discord = require("discord.js");
const dbFunction = require("../db/dbFunction");
const dbObjects = require("../db/dbObjects");
let movies = [];
let movieListEmbedMessage;

module.exports = {
  name: "movies",
  aliases: ["movie"],
  description: "Movie commands.",
  argumentDescription: "The argument needs to be a subcommand and movie name",
  roles: ["Admin", "Mod", "omar-chan"],
  args: false,
  usage: "add [db/list] [movie name], remove [db/list] [movie name], etc",
  guildOnly: true,
  cooldown: 0.2,
  category: "Misc",
  execute(message, args) {
    //get the channel id for planned-meetups
    const channel = message.client.channels.cache.get("468170551135961108");
    if (!args.length) {
      //if there isn't any arguments then send all the commands related to movies
      const moviesEmbed = new Discord.MessageEmbed()
        .setTitle("Movies Arguments:")
        .setColor("#ff4242")
        .addFields(
          {
            name: "list",
            value: "Prints 10 movies in planned-meetups to be voted on.",
          },
          {
            name: "add [db/list] [movie name]",
            value: "Adds a movie to the list or database.",
          },
          {
            name: "remove [db/list] [movie name]",
            value: "Removes a movie from the list or database.",
          },
          {
            name: "check [movie name]",
            value: "Check if the desired movie is already in the database.",
          },
          {
            name: "Show",
            value: "Displays all movies in the database.",
          }
        );
      return message.reply(moviesEmbed);
    }

    switch (args[0]) {
      //if the argument is list then find 10 random unique movies from the js object
      //and send them as an embed to the planned meet-ups channel
      case "list":
        let list = "";
        movies = [];
        movieListEmbedMessage;
        if (dbObjects.movies.length > 10) {
          for (let i = 0; i < 10; i++) {
            let random;
            //get 10 random unique entries
            do {
              random = Math.floor(Math.random() * dbObjects.movies.length);
            } while (
              movies.includes(dbObjects.movies[Math.floor(random)].name)
            );
            movies.push(dbObjects.movies[Math.floor(random)].name);
            list += `${i + 1}) ${dbObjects.movies[Math.floor(random)].name} \n`;
          }
        }
        //if all movies is less than 10 then just print them normally
        else {
          for (let i = 0; i < dbObjects.movies.length; i++) {
            movies.push(dbObjects.movies[i].name);
            list += `${i + 1}) ${dbObjects.movies[i].name} \n`;
          }
        }
        const movieListEmbed = new Discord.MessageEmbed()
          .setTitle("Movies List:")
          .setColor("#ff4242")
          .addFields({
            name: "Vote down below for this week's movie.",
            value: list,
          });

        movieListEmbedMessage = channel
          .send(movieListEmbed)
          .then((sentMessage) => {
            movieListEmbedMessage = sentMessage;
            sentMessage.react("1⃣");
            sentMessage.react("2⃣");
            sentMessage.react("3⃣");
            sentMessage.react("4⃣");
            sentMessage.react("5⃣");
            sentMessage.react("6⃣");
            sentMessage.react("7⃣");
            sentMessage.react("8⃣");
            sentMessage.react("9⃣");
            sentMessage.react("🔟");
          });
        break;
      case "add":
        let movieName = "";
        //if the user doesnt give any movie then the arguments would be
        //less than three so you can't add anything
        if (args.length < 3)
          return message.reply("What movie should be added.");
        if (args[1] === "db") {
          //get the name of the movie from user's message
          for (let i = 2; i < args.length; i++) {
            movieName += `${args[i]} `;
          }
          //insert the movie into the database and js object
          dbFunction.addMovie(movieName).then((promise) => {
            return message.reply(promise);
          });
        } else if (args[1] === "list") {
          //need to generate a movie list first before you can modify it
          if (movies.length < 1)
            return message.reply("Generate a movie list first.");
          //check if the movie list already has 10 movies
          else if (movies.length >= 10)
            return message.reply("Movie list is full.");

          //get the name of the movie from user's message
          for (let i = 2; i < args.length; i++) {
            movieName += `${args[i]} `;
          }
          movies.push(movieName.trim());

          let list = "";
          for (let i = 0; i < movies.length; i++) {
            list += `${i + 1}) ${movies[i]} \n`;
          }
          if (movies.length < 1) {
            return message.reply(
              "No movies left. Regenerate the list or add movies into the database."
            );
          }
          //insert into array then regenerate and edit the sent embed with the new movies and reactions
          const newMovieListEmbed = new Discord.MessageEmbed()
            .setTitle("Movies List:")
            .setColor("#ff4242")
            .addFields({
              name: "Vote down below for this week's movie.",
              value: list,
            });
          movieListEmbedMessage
            .edit(newMovieListEmbed)
            .then(() => {
              movieListEmbedMessage.reactions.removeAll();
            })
            .then(() => {
              if (movies.length > 0) movieListEmbedMessage.react("1⃣");
              if (movies.length > 1) movieListEmbedMessage.react("2⃣");
              if (movies.length > 2) movieListEmbedMessage.react("3⃣");
              if (movies.length > 3) movieListEmbedMessage.react("4⃣");
              if (movies.length > 4) movieListEmbedMessage.react("5⃣");
              if (movies.length > 5) movieListEmbedMessage.react("6⃣");
              if (movies.length > 6) movieListEmbedMessage.react("7⃣");
              if (movies.length > 7) movieListEmbedMessage.react("8⃣");
              if (movies.length > 8) movieListEmbedMessage.react("9⃣");
              if (movies.length > 9) movieListEmbedMessage.react("🔟");
            });
        } else return message.reply("Incorrect add arguments.");
        break;
      case "remove":
        let chosenMovie = "";
        if (args.length < 3)
          return message.reply("What movie should be removed.");
        if (args[1] === "db") {
          for (let i = 2; i < args.length; i++) {
            chosenMovie += `${args[i]} `;
          }
          //remove the movie from the database and js object
          dbFunction.removeMovie(chosenMovie).then((promise) => {
            return message.reply(promise);
          });
        } else if (args[1] === "list") {
          //need to generate a movie list first before you can modify it
          if (movies.length < 1)
            return message.reply("Generate a movie list first.");
          //get the movie title or check if they want to remove using the index
          if (isNaN(args[2])) {
            for (let i = 2; i < args.length; i++) {
              chosenMovie += `${args[i]} `;
            }
            //find and remove the movie from the movie array
            let index = movies.indexOf(chosenMovie.trim());
            if (index > -1) {
              movies.splice(index, 1);
            } else return message.reply("That movie is not in the list.");
          } else if (
            parseInt(args[2]) > 0 &&
            parseInt(args[2]) < movies.length + 1
          ) {
            movies.splice(parseInt(args[2] - 1), 1);
          } else {
            return message.reply(
              "Invalid remove arguments. Enter the movie anme or a number from 1 to list length."
            );
          }
          //combine all the movies name into one string
          let list = "";
          for (let i = 0; i < movies.length; i++) {
            list += `${i + 1}) ${movies[i]} \n`;
          }
          if (movies.length < 1) {
            return message.reply(
              "No movies left. Regenerate the list or add movies into the database."
            );
          }
          //remove from movies array then regenerate and edit the sent embed with the new movies and reactions
          const newMovieListEmbed = new Discord.MessageEmbed()
            .setTitle("Movies List:")
            .setColor("#ff4242")
            .addFields({
              name: "Vote down below for this week's movie.",
              value: list,
            });
          movieListEmbedMessage
            .edit(newMovieListEmbed)
            .then(() => {
              movieListEmbedMessage.reactions.removeAll();
            })
            .then(() => {
              if (movies.length > 0) movieListEmbedMessage.react("1⃣");
              if (movies.length > 1) movieListEmbedMessage.react("2⃣");
              if (movies.length > 2) movieListEmbedMessage.react("3⃣");
              if (movies.length > 3) movieListEmbedMessage.react("4⃣");
              if (movies.length > 4) movieListEmbedMessage.react("5⃣");
              if (movies.length > 5) movieListEmbedMessage.react("6⃣");
              if (movies.length > 6) movieListEmbedMessage.react("7⃣");
              if (movies.length > 7) movieListEmbedMessage.react("8⃣");
              if (movies.length > 8) movieListEmbedMessage.react("9⃣");
              if (movies.length > 9) movieListEmbedMessage.react("🔟");
            });
        } else return message.reply("Incorrect remove arguments.");
        break;
      case "check":
        if (args.length < 2) return message.reply("Give a movie name.");
        //get the movie name
        let inserted = "";
        for (let i = 1; i < args.length; i++) {
          inserted += `${args[i]} `;
        }
        //check if its in the database
        let index = dbObjects.movies.findIndex(
          (movie) => movie.name === inserted.trim()
        );
        //if it id in the database the index would be greater than -1
        if (index > -1)
          return message.reply(`${inserted.trim()} is in the database.`);
        return message.reply(`${inserted.trim()} is not in the database.`);
        break;
      case "show":
        let movieList = "";
        for (let i = 0; i < dbObjects.movies.length; i++) {
          movieList += `${i + 1}) ${dbObjects.movies[i].name}\n`;
        }
        message.channel.send(`Current movie list: \n ${movieList}`, {
          split: true,
        });
        break;
    }
  },
};
