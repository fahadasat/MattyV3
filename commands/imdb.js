/*
This command will return an embed of the movie details using the imdb apis
*/
let nameToImdb = require("name-to-imdb");
let imdb = require("imdb");
const Discord = require("discord.js");
module.exports = {
  name: "imdb",
  aliases: ["imbd"],
  description: "Gives the imdb details for a movie.",
  argumentDescription: "A movie.",
  // roles: ["Admin", "Mod", "Student"],
  args: true,
  usage: "[movie name]",
  guildOnly: false,
  cooldown: 5,
  category: "Misc",
  execute(message, args) {
    if (args.length < 1) return;
    let insertedMovie = args.join(" ").trim();

    let genre = "";

    //get id and some data from the from api then use the id in the
    //second api to get the rest of the data then print it all to an embed
    getIMBDDataOne(insertedMovie).then((inf) => {
      if (inf.meta.id.startsWith("nm"))
        return message.reply("Can't find that movie, sorry.");
      else
        getIMBDDataTwo(inf.meta.id).then((data) => {
          for (let i = 0; i < data.genre.length; i++) {
            genre += data.genre[i];
          }
          if (inf.meta.similarity < 1)
            message.reply(`Did you mean: ${inf.meta.name}`);
          const exampleEmbed = new Discord.MessageEmbed()
            .setColor("#ff4242")
            .setTitle(`${inf.meta.name} (${data.year})`)
            .setDescription(data.description)
            .addFields(
              {
                name: "Runtime",
                value: `\u200B ${data.runtime}`,
                inline: true,
              },
              { name: "Genre", value: genre, inline: true },
              {
                name: "Starring",
                value: inf.meta.starring,
                inline: false,
              },
              { name: "Director", value: data.director },
              { name: "Writer", value: data.writer },
              {
                name: "Ratings",
                value: `IMDB Rating: ${data.rating}\nMetascore: ${data.metascore}\nContent Rating: ${data.contentRating}`,
              }
            )
            .setImage(inf.meta.image.src)
            .setTimestamp();
          if (data.poster !== "N/A") exampleEmbed.setThumbnail(data.poster);
          return message.reply(exampleEmbed);
        });
    });
  },
};

function getIMBDDataOne(insertedMovie) {
  return new Promise((resolve) => {
    //get the movie imdb id
    try {
      nameToImdb(insertedMovie.trim(), function (err, res, inf) {
        resolve(inf);
      });
    } catch (error) {
      console.log(error);
    }
  });
}

function getIMBDDataTwo(id) {
  return new Promise((resolve) => {
    //get the movie imdb id
    try {
      imdb(id, function (err, data) {
        resolve(data);
      });
    } catch (error) {
      console.log(error);
    }
  });
}
