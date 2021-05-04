const Discord = require("discord.js");
const ayarlar = require('../ayarlar.json');
const db = require("quick.db");

exports.run = async (client, message, args) => {

    let tagcım = ayarlar.tag;
    let yetkilicik = ayarlar.yetkilirol;
    let erkekrol1 = ayarlar.erkekrol;
    let erkekrol2 = ayarlar.erkekrol2;
    let unregister = ayarlar.kayıtsızrol;
    let kayıtçet = ayarlar.registersohbet;
    let savelog = ayarlar.savelog;
    let genelçet = ayarlar.genelchat;

    let toplamkayıt = db.fetch(`toplamkayıt_${message.author.id}`)
    let erkekab = db.fetch(`erkekKisi_${message.author.id}`)
    db.add(`toplamkayıt_${message.author.id}`, 1)
    db.add(`erkekKisi_${message.author.id}`, 1)

    if(message.channel.id !== kayıtçet) return message.channel.send(`Sadece Burda Kullanabilirsin <#${kayıtçet}>`)

    if(!message.member.roles.cache.get(yetkilicik)) return message.channel.send(`Bu Komutu Kullanabilmek İçin <@&${yetkilicik}> Rolüne Sahip Olman Gerekiyor.`)

    const genelchatt = message.guild.channels.cache.find(c => c.id === genelçet)

    const savelogg = message.guild.channels.cache.find(s => s.id === savelog)

    let kullanici = message.mentions.users.first() || message.guild.members.cache.get(args[0]);

    if(!kullanici) return message.channel.send(`Kimi Erkek Olarak Kaydetceksin?`)

    let ad = args[1]; 
    let yas = args[2];

    if(!ad) return message.channel.send(`Bir İsim Belirtirmisin?`)

    if(!yas) return message.channel.send(`Bir Yaş Belirtirmisin?`)

    let membır = message.guild.member(kullanici)

    membır.setNickname(`${tagcım} ${ad} | ${yas}`)
    membır.roles.remove(unregister)
    membır.roles.add(erkekrol1)
    membır.roles.add(erkekrol2)

    const schawn = new Discord.MessageEmbed()
     .setColor(`GREEN`)
     .setTitle(`<a:schawntik:834484844876398622> Kayıt İşlemi Başarılı!`)
     .setDescription(`Başarıyla ${kullanici} kullanıcısı **${tagcım} ${ad} | ${yas}** olarak kaydedildi!\n\nAlınan rol: <@&${unregister}>\nVerilen Roller: <@&${erkekrol1}>, <@&${erkekrol2}>`)
     .setFooter(`Toplam Kayıt Sayınız: ${toplamkayıt ? `${toplamkayıt}`: "0"}\nErkek Kayıt Sayınız: ${erkekab ? `${erkekab}`: "0"}`)

     message.channel.send(schawn)
    .then(x => x.delete({ timeout: 5000 }))

savelogg.send(new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
      .setDescription(`• Yetkili: ${message.author}\n• Kayıt Yapılan Kullanıcı: ${kullanici}\n• Güncel İsmi: **${tagcım} ${ad} | ${yas}**\n• Verilen Roller: <@&${erkekrol1}>, <@&${erkekrol2}> \n• Kayıt Yapılan Kanal: <#${message.channel.id}> \n• Toplam Kayıtlar: **${toplamkayıt}**`)
      .setColor("#65d8c4"));

genelchatt.send(`${kullanici} Aramıza katıldı! Güzel karşılayın arkadaşı.`)
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["erkek", "e"],
  permLevel: 0
};

exports.help = {
  name: "erkek",
  usage: "erkek"
};  

