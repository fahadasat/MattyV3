const mongo = require("../mongo");
const userDtlsSchema = require("../schemas/userDtlsSchema");
const dbObjects = require("../db/dbObjects");

let time = [];

//first event triggers when a message has been sent, if that happens update the databse and js array
//second event triggers when someone leaves/joins, mutes, deafens
module.exports = async (client) => {
  client.on("message", async (message) => {
    if (message.author.bot) return;

    //been getting errors in the db that the channel name is null
    if (message.channel.name == null) return;

    //the first section updates the js array, the second section updates the database

    //first increase the total and average message values
    //if it fails then it means the user wasnt in the database the last time data was loaded
    //so the outer catch creates the user object and pushes it in the js array

    //if the try works sucessfully then try to increase the counter for the
    //coressponding channel, if the channel name with the same doesnt exist in the user object
    //then the inner catch pushes a new channel object
    try {
      dbObjects.userDtls.find((user) => user._id === message.author.id)
        .avgMessage++;
      dbObjects.userDtls.find((user) => user._id === message.author.id)
        .totalMessage++;

      //increment the channel word value
      try {
        dbObjects.userDtls
          .find((user) => user._id === message.author.id)
          .channels.find(
            (channel) => channel.channelName === message.channel.name
          ).messages++;
      } catch (err) {
        dbObjects.userDtls
          .find((user) => user._id === message.author.id)
          .channels.push({
            channelName: message.channel.name,
            messages: 1,
          });
      }
      addWords(message);
    } catch (err) {
      let user = {
        channels: [
          {
            channelName: message.channel.name,
            messages: 1,
          },
        ],
        totalVC: [],
        allWords: [],
        _id: message.author.id,
        __v: 0,
        avgMessage: 1,
        totalMessage: 1,
        totalTimeVC: 0,
        avgVC: 0,
        username: message.author.username,
      };
      dbObjects.userDtls.push(user);
      addWords(message);
    }
    //create a new row in the table if nothing is returned when the query is the author id
    //if the row exists then increment
    try {
      await userDtlsSchema
        .findOneAndUpdate(
          {
            _id: message.author.id,
          },
          {
            $set: {
              username: message.author.username,
            },
            $inc: {
              totalMessage: 1,
              avgMessage: 1,
              totalTimeVC: 0,
              avgVC: 0,
            },
          },
          {
            upsert: true,
          }
        )
        .exec();

      //the next to sections is to increment the channel message values if the channel object exists
      await userDtlsSchema
        .updateOne(
          {
            _id: message.author.id,
            channels: { $elemMatch: { channelName: message.channel.name } },
          },
          {
            $inc: {
              "channels.$.messages": 1,
            },
          }
        )
        .exec();
      if (message.channel.name == null) return;
      //the final section is create the object if the user is talking into a new channel
      await userDtlsSchema
        .updateOne(
          {
            _id: message.author.id,
            channels: {
              $not: {
                $elemMatch: {
                  channelName: message.channel.name,
                },
              },
            },
          },
          {
            $addToSet: {
              channels: {
                channelName: message.channel.name,
                messages: 1,
              },
            },
          }
        )
        .exec();
    } catch (err) {
      console.log(
        `error while adding new messages to db on messageCounter.js ${err}`
      );
    }
  });

  //https://www.reddit.com/r/discordapp/comments/6p85uf/discordjs_any_way_to_detect_when_someone_enter_a/
  //start a timer for the user when they join/leave a voice channel
  client.on("voiceStateUpdate", (oldMember, newMember) => {
    if (oldMember.channel === null && newMember.channel !== null) {
      //user enters vc
      enters(newMember);
    } else if (newMember.channel === null) {
      //user leaves vc
      leaves(oldMember);
    } else if (oldMember.channel !== null && newMember.channel !== null) {
      //user switches channels
      leaves(newMember);
      enters(newMember);
    }
  });
};

//create a time for a user when they enter a voice channel
function enters(newMember) {
  time.push({
    user: newMember.member.user.id,
    channel: newMember.channel.name,
    time: new Date(),
  });
}

//remove the user from the timer and add how long they were into the database and js array
async function leaves(oldMember) {
  //find the user from the timer
  let temp = time.find((user) => user.user === oldMember.member.user.id);
  //remove the user from the timer
  time.splice(
    time.findIndex((user) => user.user === oldMember.member.user.id),
    1
  );

  //convert how long they spent in the voice channel to minutes
  let id = temp.user;
  let insert = {
    channel: temp.channel,
    time: Math.floor((new Date() - temp.time) / 1000 / 60),
  };

  //insert into array if they are new, or increment the timer if they have been in voice before
  try {
    dbObjects.userDtls.find((user) => user._id === id).totalTimeVC +=
      insert.time;
    dbObjects.userDtls.find((user) => user._id === id).avgVC += insert.time;

    try {
      dbObjects.userDtls
        .find((user) => user._id === id)
        .totalVC.find((voice) => voice.channel === insert.channel).time +=
        insert.time;
    } catch (err) {
      dbObjects.userDtls.find((user) => user._id === id).totalVC.push(insert);
    }
  } catch (err) {
    let user = {
      channels: [],
      allWords: [],
      totalVC: [insert],
      _id: id,
      __v: 0,
      avgMessage: 0,
      totalMessage: 0,
      totalTimeVC: insert.time,
      avgVC: insert.time,
      username: oldMember.member.user.username,
    };
    dbObjects.userDtls.push(user);
  }

  //create a new row in the table if nothing is returned when the query is the author id
  //if the row exists then increment
  try {
    await userDtlsSchema
      .findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            username: oldMember.member.user.username,
          },
          $inc: {
            totalMessage: 0,
            avgMessage: 0,
            totalTimeVC: insert.time,
            avgVC: insert.time,
          },
        },
        {
          upsert: true,
        }
      )
      .exec();

    //the next to sections is to increment the specific voice channel times if the voice channel object exists
    await userDtlsSchema
      .updateOne(
        {
          _id: id,
          totalVC: { $elemMatch: { channel: insert.channel } },
        },
        {
          $inc: {
            "totalVC.$.time": insert.time,
          },
        }
      )
      .exec();

    //the final section is create the object if the user went into a new voice channel
    await userDtlsSchema
      .updateOne(
        {
          _id: id,
          totalVC: {
            $not: {
              $elemMatch: {
                channel: insert.channel,
              },
            },
          },
        },
        {
          $addToSet: {
            totalVC: {
              channel: insert.channel,
              time: insert.time,
            },
          },
        }
      )
      .exec();
  } catch (err) {
    console.log(
      `error while adding new voice time to db on messageCounter.js ${err}`
    );
  }
}

async function addWords(message) {
  //increment the counter for each word if the word has been said before, if it hasn't then create the counter
  let msg = message.content
    .replace(/[^A-Za-z']/g, " ")
    .trim()
    .split(/ +/);

  for (let i = 0; i < msg.length; i++) {
    if (msg[i] === "") return;
    else {
      //first section is to increment the javascript array
      try {
        dbObjects.userDtls
          .find((user) => user._id === message.author.id)
          .allWords.find((words) => words.word === msg[i]).count++;
      } catch (err) {
        dbObjects.userDtls
          .find((user) => user._id === message.author.id)
          .allWords.push({
            word: msg[i],
            count: 1,
          });
      }

      //second section is to increment the database
      try {
        //increment the message counter if it exits
        await userDtlsSchema
          .updateOne(
            {
              _id: message.author.id,
              allWords: { $elemMatch: { word: msg[i] } },
            },
            {
              $inc: {
                "allWords.$.count": 1,
              },
            }
          )
          .exec();

        //create the object if the user said a new word
        await userDtlsSchema
          .updateOne(
            {
              _id: message.author.id,
              allWords: {
                $not: {
                  $elemMatch: {
                    word: msg[i],
                  },
                },
              },
            },
            {
              $addToSet: {
                allWords: {
                  word: msg[i],
                  count: 1,
                },
              },
            }
          )
          .exec();
      } catch (err) {
        console.log(
          `error while adding new word counters to db on messageCounter.js ${err}`
        );
      }
    }
  }
}
