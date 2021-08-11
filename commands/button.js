// //press the button for april event

// const Discord = require("discord.js");
// let start = false;
// let timer = 43200000;
// let countdownInterval;
// let countdownEmbed;

// module.exports = {
//   name: "button",
//   aliases: ["press"],
//   description: "Enters you into the button.",
//   argumentDescription: "Press the button.",
//   roles: ["Admin", "Mod", "Student"],
//   args: true,
//   usage: "[press]",
//   guildOnly: true,
//   cooldown: 300, //21600
//   category: "Fun",
//   execute(message, args) {
//     const channel = message.client.channels.cache.get("826193024425787402");

//     //make sure the timer is in a specific channel
//     if (message.channel.id !== channel.id)
//       return message.reply("Wrong channel.");
//     switch (args[0]) {
//       case "start":
//         //only mods can start the counter
//         if (!message.member.roles.cache.some((role) => role.name === "Mod")) {
//           setTimeout(() => message.delete(), 1000);
//           return;
//         }

//         //check if game has started
//         if (start) {
//           setTimeout(() => message.delete(), 1000);
//           message.reply("Game already started.");
//           return;
//         }
//         //delete the start message so it doesn't clutter up the channel
//         //reset the timer and make the start boolean true
//         start = true;
//         timer = 43200000;
//         //create and send the new embed with the timer converted to a readable format
//         const timerEmbed = new Discord.MessageEmbed()
//           .setColor("#ff4242")
//           .setTitle("~button press")
//           .addFields({
//             name: msToHMS(timer),
//             value: "\u200B",
//           });
//         //send the embed to the desired channel and set it equal to the variable so it can be editted later on
//         channel.send(timerEmbed).then((sentMessage) => {
//           countdownEmbed = sentMessage;
//         });

//         //after every 10 seconds, decrement the counter and
//         // create a new embed and edit it with the old one
//         //check if the timer is at 0, if it is then stop the game
//         countdownInterval = setInterval(function () {
//           try {
//             //decrease the timer and check if it hits 0
//             if (timer > 0) timer -= 5 * 1000;
//             if (timer < 0) timer = 0;
//             if (timer === 0) {
//               start = false;
//               clearInterval(countdownInterval);
//               countdownEmbed.channel.send("Game has ended.");
//             }

//             const timerEmbed = new Discord.MessageEmbed()
//               .setColor("#ff4242")
//               .setTitle("~button press")
//               .addFields({
//                 name: msToHMS(timer),
//                 value: "\u200B",
//               });
//             channel.send(timerEmbed);
//             // countdownEmbed.edit(timerEmbed);
//           } catch (error) {
//             console.log(error);
//           }
//         }, 5 * 1000);
//         setTimeout(() => message.delete(), 1000);
//         break;
//       case "end":
//         //check if the game has started
//         if (!start) {
//           message.reply("Game hasn't started.");
//           setTimeout(() => message.delete(), 1000);
//           return;
//         }
//         //only mods can stop the countdown
//         if (!message.member.roles.cache.some((role) => role.name === "Mod")) {
//           setTimeout(() => message.delete(), 1000);
//           return;
//         }
//         //end the game
//         start = false;
//         clearInterval(countdownInterval);
//         setTimeout(() => message.delete(), 1000);
//         break;
//       case "press":
//         //check if the game started
//         if (!start) {
//           setTimeout(() => message.delete(), 1000);
//           return;
//         }
//         //reset the timer and get the different roles in a variable to make life easier
//         let yellow = message.guild.roles.cache.find((r) => r.name === "yellow");
//         let lime = message.guild.roles.cache.find((r) => r.name === "lime");
//         let purple = message.guild.roles.cache.find((r) => r.name === "purple");
//         let red = message.guild.roles.cache.find((r) => r.name === "red");
//         let blue = message.guild.roles.cache.find((r) => r.name === "blue");

//         //check if the user has a color role already
//         //if they do then remove it and give them the new role depending on the timer
//         if (message.member.roles.cache.some((role) => role.id === yellow.id))
//           message.member.roles.remove(yellow);
//         else if (message.member.roles.cache.some((role) => role.id === lime.id))
//           message.member.roles.remove(lime);
//         else if (
//           message.member.roles.cache.some((role) => role.id === purple.id)
//         )
//           message.member.roles.remove(purple);
//         else if (message.member.roles.cache.some((role) => role.id === red.id))
//           message.member.roles.remove(red);
//         else if (message.member.roles.cache.some((role) => role.id === blue.id))
//           message.member.roles.remove(blue);

//         //check where the timer is at and give them the role
//         //between 12-8
//         if (timer < 43200001 && timer >= 28800000)
//           message.member.roles.add(yellow);
//         //between 8-4hrs
//         else if (timer < 28800000 && timer >= 14400000)
//           message.member.roles.add(lime);
//         //between 4-2hrs
//         else if (timer < 14400000 && timer >= 7200000)
//           message.member.roles.add(purple);
//         //between 2-1hrs
//         else if (timer < 7200000 && timer >= 3600000)
//           message.member.roles.add(red);
//         //between <1hrs
//         else if (timer < 3600000 && timer >= 1) message.member.roles.add(blue);
//         //reset timer
//         timer = 43200000;
//         channel.send(
//           `${message.member} has reset the button.`
//         );
//         // setTimeout(() => message.delete(), 1000);
//         break;
//     }
//   },
// };

// //convert milliscecond to a readable format
// function msToHMS(ms) {
//   // 1- Convert to seconds:
//   var seconds = ms / 1000;
//   // 2- Extract hours:
//   var hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
//   seconds = seconds % 3600; // seconds remaining after extracting hours
//   // 3- Extract minutes:
//   var minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
//   // 4- Keep only seconds not extracted to minutes:
//   seconds = seconds % 60;
//   return `${hours} : ${minutes} : ${seconds} `;
// }
