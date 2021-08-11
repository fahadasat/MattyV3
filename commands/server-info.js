/*
This command will send the server details in an embed
*/

const Discord = require("discord.js");
// const dbFunction = require("../db/dbFunction");
const dbObjects = require("../db/dbObjects");

module.exports = {
  name: "server-info",
  aliases: ["serverinfo", "server-details", "server-details", "serverdtls"],
  description: "Sends the info for the server.",
  //   argumentDescription: "",
  roles: ["Admin", "Mod", "Student"],
  args: false,
  //   usage: "",
  guildOnly: true,
  cooldown: 30,
  category: "Info",
  execute(message, args) {
    //find all special roles like admin, mod, helpers so they can be added to the embed
    let admins = message.guild.roles.cache
      .find((r) => r.name === "Admin")
      .members.map((m) => m.user.id);
    let adminString = idToString(admins);

    let mods = message.guild.roles.cache
      .find((r) => r.name === "Mod")
      .members.map((m) => m.user.id);
    let modString = idToString(mods);

    let helpers = message.guild.roles.cache
      .find((r) => r.name === "Helpers")
      .members.map((m) => m.user.id);
    let helperString = idToString(helpers);

    // let retired = message.guild.roles.cache
    //   .find((r) => r.name === "Retired Mod")
    //   .members.map((m) => m.user.id);
    // let retiredString = idToString(retired);

    // let specials = message.guild.roles.cache
    //   .find((r) => r.name === "Special")
    //   .members.map((m) => m.user.id);
    // let specialString = idToString(specials);

    let activeUsers = 0;
    let mostActiveMessenger = ["Nobody has said anything this month", 0];
    let mostActiveVoice = ["Nobody has gone to voice this month", 0];
    let totalMessages = 0;
    let totalVoice = 0;
    let monthMessages = 0;
    let monthVoice = 0;
    let concatChannel = [];
    let concatVoice = [];

    //go through each element in the array and total up all the messages and vc time
    dbObjects.userDtls.forEach((element) => {
      element.avgMessage > 0 || element.avgVC > 0 ? activeUsers++ : activeUsers;
      totalMessages += element.totalMessage;
      totalVoice += element.totalTimeVC;
      monthMessages += element.avgMessage;
      monthVoice += element.avgVC;

      //concat all the voice channel times/ channels so they can be sorted later and looped through to add all the times
      //same thing for all the text channels
      concatChannel = concatChannel.concat(element.channels);
      concatVoice = concatVoice.concat(element.totalVC);

      //if someone has talked/ messaged more than the previous member then update the moist active with their details
      if (element.avgMessage > mostActiveMessenger[1]) {
        mostActiveMessenger[0] = element._id;
        mostActiveMessenger[1] = element.avgMessage;
        mostActiveMessenger[2] = element.username;
      }
      if (element.avgVC > mostActiveVoice[1]) {
        mostActiveVoice[0] = element._id;
        mostActiveVoice[1] = element.avgVC;
        mostActiveVoice[2] = element.username;
      }
    });

    //loop through the concatanated text channels and find which one has the highest counter
    let highestChannel = ["No text channel so far.", 0];
    let tempHighestChannel = ["temp", 0];
    try {
      concatChannel.sort((a, b) => a.channelName.localeCompare(b.channelName));
      concatChannel.forEach((element) => {
        if (tempHighestChannel[0] !== element.channelName) {
          if (tempHighestChannel[1] > highestChannel[1]) {
            highestChannel = tempHighestChannel;
          }
          tempHighestChannel = [element.channelName, element.messages];
        } else tempHighestChannel[1] += element.messages;
      });
      if (tempHighestChannel[1] > highestChannel[1]) {
        highestChannel = tempHighestChannel;
      }
    } catch (err) {
      console.log(`error at text channel compare with  in server-info.js`);
    }

    //loop through the concatanated voice channels and find which one has the highest voice time
    let highestVoice = ["No voice activity so far.", 0];
    let tempHighestVoice = ["temp", 0];
    try {
      concatVoice.sort((a, b) => a.channel.localeCompare(b.channel));

      concatVoice.forEach((element) => {
        if (tempHighestVoice[0] !== element.channel) {
          if (tempHighestVoice[1] > highestVoice[1]) {
            highestVoice = tempHighestVoice;
          }
          tempHighestVoice = [element.channel, element.time];
        } else tempHighestVoice[1] += element.time;
      });
      if (tempHighestVoice[1] > highestVoice[1]) {
        highestVoice = tempHighestVoice;
      }
    } catch (err) {
      console.log(`error at voice channel compare with in server-info.js`);
    }

    const serverEmbed = new Discord.MessageEmbed()
      .setColor("0x0099ff")
      .setThumbnail(`${message.guild.iconURL()}`)
      .setFooter("These values are starting from March 2021")
      .setAuthor(
        "Matty",
        "https://lh3.googleusercontent.com/c1kzQmsGiCyTGUjs97gwCW2e-Daxx2jtlN5j_iFqaRmde3NiUH7c_p8QCOZ88BXlKrI",
        "https://www.csun.edu/"
      )
      .setTimestamp(new Date())
      .addFields(
        {
          name: "Server Info ",
          value: `Creation Date \`\`${message.guild.createdAt}\`\` \n Owner \`\`${message.guild.owner.user.username}\`\` \n Admin(s) \n${adminString} \nMod(s) \n${modString} \nHelpers(s) \n${helperString}`, // \nRetired Mods(s) ${retiredString} \nSpecials(s) ${specialString}`,
        },
        {
          name: "Members ",
          value: `Users \`\`${message.guild.memberCount}\`\` \n Active users this month \`\`${activeUsers}\`\` \nMost active texter this month <@${mostActiveMessenger[0]}> \`\`${mostActiveMessenger[1]} messages\`\`\nMost active voice member this month <@${mostActiveVoice[0]}> \`\`${mostActiveVoice[1]} minutes\`\``,
        },
        {
          name: "Member activity ",
          value: `Total messages \`\`${totalMessages} messages\`\` \nTotal VC time \`\`${totalVoice} minutes\`\` \nMessages this month \`\`${monthMessages} messages\`\`  \nVC this month \`\`${monthVoice} minutes\`\` \n Top text channel \`\`${highestChannel[0]} ${highestChannel[1]} messages\`\`  \nTop voice channel \`\`${highestVoice[0]} ${highestVoice[1]} minutes\`\``,
        }
      );

    return message.reply(serverEmbed);
  },
};

//make the id of a user pingable
function idToString(idArray) {
  nameString = "";
  idArray.forEach((element) => {
    nameString += `<@${element}> \n`;
  });
  return nameString;
}
