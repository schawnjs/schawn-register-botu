const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');
const db = require("quick.db");

exports.run = (client, message, args) => {

let yetkilicik = ayarlar.yetkilirol;

if(!message.member.roles.cache.get("847578560704282634") && !message.member.hasPermission("ADMINISTRATOR")) return message.reply(`Bu Komutu Kullanabilmek İçin <@&${yetkilicik}> Rolüne Sahip Olman Gerekiyor.`)

let schawn = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));

if(!schawn) { return message.reply("Kimin İsim Verilerini Silceksin.") }

if(!schawn) { // kendi isim datasını siliorsunuz
    let totalisimler = db.delete(`isimcm_${schawn.user.id}`)

    message.react("<a:schawntik:834484844876398622>")

    return message.channel.send(new Discord.MessageEmbed()
     .setAuthor(schawn.user.displayName, schawn.user.avatarURL({ dynamic: true }))
     .setColor("GREEN")
     .setDescription(`Kendi İsim Verilerini Başarıyla Sıfırladın.`))
}

if(schawn) { // kullanıcının isim datasını siliorsunuz

    let totalisimler = db.delete(`isimcm_${schawn.user.id}`)

    message.react("<a:schawntik:834484844876398622>")

    return message.channel.send(new Discord.MessageEmbed()
     .setAuthor(schawn.user.displayName, schawn.user.avatarURL({ dynamic: true }))
     .setColor("GREEN")
     .setDescription(`Başarıyla ${schawn} Adlı Kullanıcının İsim Verilerini Sıfırladın.`))
 }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["isim-sıfırla", "isimsıfırla", "isimler-sıfırla", "isimlersıfırla"],
    permLevel: 0,
    name: "isim-sıfırla"
  }
  
  exports.help = {
    name: "isim-sıfırla"
  }