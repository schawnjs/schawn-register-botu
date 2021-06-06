const Discord = require("discord.js");
const ayarlar = require("../ayarlar.json");

exports.run = (client, message ,args) => {

let yetkilicik = ayarlar.yetkilirol;
let schawn = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
let xd = args.slice(1).join(" ");

if(!schawn) {
    return message.reply("Adını Değiştirceğin Kişiyi Etiketle.")
    .then(x => x.delete({ timeout: 1500 }));
}

if(!message.member.roles.cache.get("832269305814450196") && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`Bu Komutu Kullanabilmek İçin <@&${yetkilicik}> Rolüne Sahip Olman Gerekiyor.`)

schawn.setNickname(xd).then(() => {
    return message.channel.send(`${schawn} İsimli kullanıcının adı başarıyla \`${xd}\` oldu.`)
    .then(x => x.delete({ timeout: 3000 }));
}).catch(() => {
    return message.channel.send("Bu Kişinin Adını Değiştiremezsin.")
    .then(x => x.delete({ timeout: 3000 }));
}); 

}

exports.conf = {
  aliases: ["i", "isim-değiştir", "isimdeğiştir", "isim"],
  permLevel: 0
};

exports.help = {
  name: "isim"
};