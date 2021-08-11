/*
This command will update the users school year
*/

module.exports = {
  name: "updaterole",
  aliases: ["updateyear", "updateme"],
  description: "Updates your school year.",
  //   argumentDescription: "",
  roles: ["Admin", "Mod", "Student"],
  args: false,
  //   usage: "",
  guildOnly: true,
  cooldown: 1578000,
  category: "Utilities",
  execute(message, args) {
    //get the role objects
    let Freshman = message.guild.roles.cache.find((r) => r.name === "Freshman");
    let Sophomore = message.guild.roles.cache.find(
      (r) => r.name === "Sophomore"
    );
    let Junior = message.guild.roles.cache.find((r) => r.name === "Junior");
    let Senior = message.guild.roles.cache.find((r) => r.name === "Senior");
    let Alumni = message.guild.roles.cache.find((r) => r.name === "Alumni");
    let Masters = message.guild.roles.cache.find((r) => r.name === "Masters");

    //let the mod know the person updated their role
    message.channel.send(
      `<@&${message.guild.roles.cache.find((r) => r.name === "Mod").id}> ${
        message.author.username
      } updated their role.`
    );

    //update the role depending on what they have
    if (message.member.roles.cache.some((role) => role.id === Freshman.id)) {
      message.member.roles.add(Sophomore);
      message.member.roles.remove(Freshman);
    } else if (
      message.member.roles.cache.some((role) => role.id === Sophomore.id)
    ) {
      message.member.roles.add(Junior);
      message.member.roles.remove(Sophomore);
    } else if (
      message.member.roles.cache.some((role) => role.id === Junior.id)
    ) {
      message.member.roles.add(Senior);
      message.member.roles.remove(Junior);
    } else if (
      message.member.roles.cache.some((role) => role.id === Senior.id)
    ) {
      message.member.roles.add(Alumni);
      message.member.roles.remove(Senior);
    } else if (
      message.member.roles.cache.some((role) => role.id === Alumni.id)
    ) {
      message.member.roles.add(Masters);
      message.member.roles.remove(Alumni);
    }
  },
};
