const Discord = require("discord.js");
const ayarlar = require("../ayarlar.json");
const db = require("quick.db");

exports.run = (client, message, args) => {

let yetkilicik = ayarlar.yetkilirol;
let isim = message.mentions.users.first() || message.guild.members.cache.get(args[0])
if(!isim) return message.channel.send("Kullanıcı Belirt.") // kullanıcıyı tanımlıoruz

var sayıcm = 1

if(!message.member.roles.cache.get("847578560704282634") && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`Bu Komutu Kullanabilmek İçin <@&${yetkilicik}> Rolüne Sahip Olman Gerekiyor.`)

let dataa = db.get(`isimcm_${message.guild.id}`)
if(!dataa) return message.channel.send(`${isim} İsimli kullanıcı daha önce hiç kayıt olmamış.`)

let bütünisimler = dataa.filter(oys => oys.user === isim.id).map(oa => `${sayıcm++} - \`> ${oa.isim} | ${oa.yas}\`\n`).join("\n")

const schawn = new Discord.MessageEmbed()
 .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
 .setColor("#1ac0f0")
 .setDescription(`

 **Bu Kullanıcı Toplam \`${sayıcm-1}\` Kere Kayıt Olmuş.**
 
 ${bütünisimler}

 `)
  return message.channel.send(schawn)
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['isimler', 'eskiisim', "eski-isim"],
  permLevel: 0,
}
  
exports.help = {
  name: "isimler"
}