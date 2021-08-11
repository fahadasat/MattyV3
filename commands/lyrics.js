/*
This command will return the lyrics of a song
*/

// import GeniusFetcher from "genius-lyrics-fetcher";
const GeniusFetcher = require("genius-lyrics-fetcher");
const ACCESS_TOKEN =
  "7R8YkN3OmB0eBcH6AniWDTUUk7HdX8nhIkjkyIK6DFhaBl7aqzIqyGnuLvaH-Utl";
const client = new GeniusFetcher.Client(ACCESS_TOKEN);

module.exports = {
  name: "lyrics",
  aliases: ["lyric", "song", "songDetails"],
  description: "Gives the lyrics of a song from Genius.com.",
  argumentDescription: "A song with the artist name.",
  // roles: ["Admin", "Mod", "Student"],
  args: true,
  usage: "[song name]",
  guildOnly: false,
  cooldown: 5,
  category: "Misc",
  execute(message, args) {
      //get the song name
    let insertedSong = args.join(" ").trim();
    //ask and wait for the artist's name
    message
      .reply(`What is ${insertedSong}'s artist?`)
      .then((sentMessage) => {
        const filter = (m) => message.author.id === m.author.id;
        sentMessage.channel
          .awaitMessages(filter, {
            time: 30000,
            max: 1,
            errors: ["time"],
          })
          .then(async (msg) => {
            try {
                //search for the lyrics on genius using the song name and artist
              const result = await client.fetch(
                insertedSong,
                msg.first().content
              );
              //split the message if the lyrics are too long
              message.channel.send(result.lyrics, { split: true });
            } catch (error) {
              message.reply(
                "Incorrect arguments or the song couldn't be found."
              );
            }
          });
      })
      .catch((error) => {
        console.log(error);
        message.reply("Incorrect arguments or the song couldn't be found.");
      });
  },
};
