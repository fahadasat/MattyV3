/*
This command will display a list of infor about a user
*/
const Discord = require("discord.js");
const dbFunction = require("../db/dbFunction");
const dbObjects = require("../db/dbObjects");

module.exports = {
  name: "user-info",
  aliases: ["userinfo", "user-details", "userdetails", "userdtls", "usrdtls"],
  description: "Sends the info for a user.",
  argumentDescription: "The argument needs to be a user.",
  roles: ["Admin", "Mod", "Student"],
  args: true,
  usage: "[@user]",
  guildOnly: true,
  cooldown: 5,
  category: "Info",
  execute(message, args) {
    //get the mention of whoever was pinged to get details of
    let guildMember = message.guild.member(message.mentions.users.first());
    //get all the information from the database
    //get this month's voice time, this months messages (avg is a bad name im just now realizing)
    //get total vc time and total msgs
    //get favourite word, get top text channels, etc
    let avg;
    try {
      avg = dbFunction.getAvgMessages(guildMember.id);
    } catch {
      return message.reply("That wasn't a valid user.");
    }
    let total = dbFunction.getTotalMessages(guildMember.id);

    let avgTime = dbFunction.getAvgVC(guildMember.id);
    let totalTime = dbFunction.getTotalVC(guildMember.id);

    let topChannels = "";
    let topVC = "";
    let topWord = "";
    let channelArray;
    let voiceArray;
    let wordArray;

    //sorting array of objects by property value
    //https://stackoverflow.com/questions/979256/sorting-an-array-of-objects-by-property-values
    try {
      channelArray = dbObjects.userDtls
        .find((user) => user._id === guildMember.id)
        .channels.sort(
          (a, b) => parseFloat(b.messages) - parseFloat(a.messages)
        );

      if (channelArray.length > 4) {
        for (i = 0; i < 5; i++) {
          topChannels += `${i + 1})${channelArray[i].channelName} \`\` ${
            channelArray[i].messages
          } \`\`\n`;
        }
      } else if (channelArray.length < 5 && channelArray.length > 0) {
        for (i = 0; i < channelArray.length; i++) {
          topChannels += `${i + 1})${channelArray[i].channelName} \`\` ${
            channelArray[i].messages
          } \`\`\n`;
        }
      } else {
        topChannels = "This user hasn't sent a message yet.";
      }
    } catch (error) {
      topChannels = "This user hasn't sent a message yet.";
    }
    //most used word
    try {
      wordArray = dbObjects.userDtls
        .find((user) => user._id === guildMember.id)
        .allWords.sort((a, b) => parseFloat(b.count) - parseFloat(a.count));

      if (wordArray.length > 0) {
        topWord = wordArray[0].word;
      } else {
        topWord = "This user hasn't sent a message yet.";
      }
    } catch (error) {
      topWord = "This user hasn't sent a message yet.";
    }
    //get this months voice and total voice time
    try {
      voiceArray = dbObjects.userDtls
        .find((user) => user._id === guildMember.id)
        .totalVC.sort((a, b) => parseFloat(b.time) - parseFloat(a.time));

      if (voiceArray.length > 4) {
        for (i = 0; i < 5; i++) {
          topVC += `${i + 1})${voiceArray[i].channel} \`\` ${
            voiceArray[i].time
          } \`\` minutes \n`;
        }
      } else if (voiceArray.length < 5 && voiceArray.length > 0) {
        for (i = 0; i < voiceArray.length; i++) {
          topVC += `${i + 1})${voiceArray[i].channel} \`\` ${
            voiceArray[i].time
          } \`\` minutes \n`;
        }
      } else {
        topVC = "This user hasn't talked yet.";
      }
    } catch (error) {
      topVC = "This user hasn't talked yet.";
    }

    //send all the information gathered above into an embed
    const userEmbed = new Discord.MessageEmbed()
      .setColor("0x0099ff")
      .setImage(`${guildMember.user.displayAvatarURL()}`)
      .setFooter("These values are starting from March 2021")
      .setTimestamp(new Date())
      .addFields(
        {
          name: `${guildMember.user.tag}`,
          value: `<@${guildMember.id}>`,
        },
        {
          name: "User Info: ",
          value: `Joined: \`\`${guildMember.joinedAt.toUTCString()}\`\` \nCreated: \`\`${guildMember.user.createdAt.toUTCString()}\`\` \nUser ID: \`\`${
            guildMember.id
          }\`\``,
        },
        {
          name: "Messages: ",
          value: `Total messages \`\`${total}\`\` \nMessages this month: \`\`${avg}\`\``,
          inline: true,
        },
        {
          name: "Voice: ",
          value: `Total time in voice \`\`${totalTime}\`\`minutes \nTime in voice this month: \`\`${avgTime}\`\`minutes`,
          inline: true,
        },
        { name: "\u200B", value: "\u200B" },
        {
          name: "Top Text Channels: ",
          value: topChannels,
          inline: true,
        },
        {
          name: "Top Voice Channels: ",
          value: topVC,
          inline: true,
        },
        { name: "Favourite word: ", value: topWord }
      );

    return message.reply(userEmbed);
  },
};
