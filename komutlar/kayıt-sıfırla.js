const Discord = require("discord.js");
const ayarlar = require('../ayarlar.json');
const db = require("quick.db");

exports.run = async (client, message, args) => {
    
    let yetkilicik = ayarlar.yetkilirol;

    if(!message.member.roles.cache.get("847578560704282634") && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`Bu Komutu Kullanabilmek İçin <@&${yetkilicik}> Rolüne Sahip Olman Gerekiyor.`)

    let kullanici = message.mentions.users.first() || message.guild.members.cache.get(args[0]);

    if(!kullanici) {
      message.react("<a:schawnxtik:834484837313413120>") 
      message.channel.send(`Kayıt Verilerini Sıfırlayacağın Kullanıcıyı Etiketle.`) 
      .then(x => x.delete({ timeout: 5000 }))
       setTimeout(() => {
       message.delete()  
      }, 5000)
    }

    let toplamab = db.fetch(`toplamkayıt_${message.author.id}`)
    let sıfırla = db.get(`toplamkayıt_${kullanici.id}`)

     db.delete(`erkekKisi_${message.author.id}`) // erkeği sıfırlıor
     db.delete(`kadinKisi_${message.author.id}`) // kadını sıfırlıor
     db.delete(`toplamkayıt_${message.author.id}`) // hepsini sıfırlıor

    message.react(`<a:schawntik:834484844876398622>`)
 
    return message.channel.send(new Discord.MessageEmbed()
     .setColor(`GREEN`)
     .setTitle(`<a:schawntik:834484844876398622> İşlem Başarılı!`)
     .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
     .setDescription(`Başarıyla ${kullanici} Adlı Kişinin Kayıt Verilerini Sıfırladım!`)
     .setTimestamp())
      .then(x => x.delete({ timeout: 5000 }))
   }

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["sıfırla", "kayıt-sıfırla", "kayıtsıfırla"],
  permLevel: 0
};

exports.help = {
  name: "sıfırla",
  usage: "sıfırla"
}; 