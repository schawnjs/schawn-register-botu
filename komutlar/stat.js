const Discord = require("discord.js");
const ayarlar = require('../ayarlar.json');
const db = require("quick.db");

exports.run = async (client, message, args) => {

     let yetkilicik = ayarlar.yetkilirol;
       
     if(!message.member.roles.cache.get(yetkilicik)) return message.channel.send(`Bu Komutu Kullanabilmek İçin <@&${yetkilicik}> Rolüne Sahip Olman Gerekiyor.`)

     let kullanici = message.mentions.users.first() || message.guild.members.cache.get(args[0]);

     if(!kullanici) { // kullanıcı etiketlemediyseniz sizinkini gösterir

     let erkekab = db.fetch(`erkekKisi_${message.author.id}`)
     let kadınab = db.fetch(`kadinKisi_${message.author.id}`)
     let toplamkayıt = db.fetch(`toplamkayıt_${message.author.id}`)

     if(erkekab === undefined) erkekab = "0"
     if(erkekab === null) erkekab = "0"

     if(kadınab === undefined) kadınab = "0"
     if(kadınab === null) kadınab = "0"

     if(toplamkayıt === undefined) toplamkayıt = "0"
     if(toplamkayıt === null) toplamkayıt = "0"
 
   const stats = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setAuthor("Toplam Kayıtlar", message.author.avatarURL({ dynamic: true }))
    .setDescription(`
    **\`>\`** Toplam Kayıt Sayın: **${toplamkayıt}** 

    **\`>\`** Erkek Kayıt Sayın: **${erkekab}** 

    **\`>\`** Kadın Kayıt Sayın: **${kadınab}**`)
    .setTimestamp()
    .setFooter(`scháwn ❤️ Pulsé`)
     return message.channel.send(stats)
     }

     /////////////////////////////////----------------------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 
     if(kullanici) { // eğer kullanıcı etiketlenmişsse onunkini gösterir

     let erkekabi = db.fetch(`erkekKisi_${kullanici.id}`)
     let kadınabi = db.fetch(`kadinKisi_${kullanici.id}`)
     let toplamkayıtab = db.fetch(`toplamkayıt_${kullanici.id}`)
   
     if(erkekabi === undefined) erkekabi = "0"
     if(erkekabi === null) erkekabi = "0"
   
     if(kadınabi === undefined) kadınabi = "0"
     if(kadınabi === null) kadınabi = "0"
   
     if(toplamkayıtab === undefined) toplamkayıtab = "0"
     if(toplamkayıtab === null) toplamkayıtab = "0"

     const statsab = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setAuthor("Etiketlediğin Kişinin Toplam Kayıtları", kullanici.avatarURL({ dynamic: true }))
      .setDescription(`
     **\`>\`** Toplam Kayıt Sayısı: **${toplamkayıtab}**

     **\`>\`** Erkek Kayıt Sayısı: **${erkekabi}**
      
     **\`>\`** Kadın Kayıt Sayısı: **${kadınabi}**`)
      .setTimestamp()
      .setFooter(`scháwn ❤️ Pulsé`)
       return message.channel.send(statsab)
     }
    }

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["stats", "stat", "toplamkayıt", "toplam-kayıt"],
  permLevel: 0
};

exports.help = {
  name: "stat",
  usage: "stat"
};  
