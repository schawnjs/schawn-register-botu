const Discord = require("discord.js");
const ayarlar = require('../ayarlar.json');
const db = require("quick.db");

exports.run = async (client, message, args) => {

    let tagcım = ayarlar.tag;
    let yetkilicik = ayarlar.yetkilirol;
    let kadınrol1 = ayarlar.kadınrol;
    let kadınrol2 = ayarlar.kadınrol2;
    let unregister = ayarlar.kayıtsızrol;
    let kayıtçet = ayarlar.registersohbet;
    let savelog = ayarlar.savelog;
    let genelçet = ayarlar.genelchat;
    
    let toplamkayıt = db.fetch(`toplamkayıt_${message.author.id}`)
    let kadınab = db.fetch(`kadinKisi_${message.author.id}`)
    db.add(`toplamkayıt_${message.author.id}`, 1)
    db.add(`kadinKisi_${message.author.id}`, 1)

    if(message.channel.id !== kayıtçet) return message.channel.send(`Sadece Burda Kullanabilirsin <#${kayıtçet}>`)

    if(!message.member.roles.cache.get(yetkilicik)) return message.channel.send(`Bu Komutu Kullanabilmek İçin <@&${yetkilicik}> Rolüne Sahip Olman Gerekiyor.`)

    const genelchatt = message.guild.channels.cache.find(c => c.id === genelçet)

    const savelogg = message.guild.channels.cache.find(s => s.id === savelog)

    let kullanici = message.mentions.users.first() || message.guild.members.cache.get(args[0]);

    if(!kullanici) return message.channel.send(`Kimi Kadın Olarak Kaydetceksin?`)

    let ad = args[1]; 
    let yas = args[2];

    if(!ad) return message.channel.send(`Bir İsim Belirtirmisin?`)

    if(!yas) return message.channel.send(`Bir Yaş Belirtirmisin?`)

    let membır = message.guild.member(kullanici)

    membır.setNickname(`${tagcım} ${ad} | ${yas}`)
    membır.roles.remove(unregister)
    membır.roles.add(kadınrol1)
    membır.roles.add(kadınrol2)

    const schawn2 = new Discord.MessageEmbed()
    .setColor(`GREEN`)
    .setTitle(`<a:schawntik:834484844876398622> Kayıt İşlemi Başarılı!`)
    .setDescription(`Başarıyla ${kullanici} kullanıcısı **${tagcım} ${ad} | ${yas}** olarak kaydedildi!\n\nAlınan rol: <@&${unregister}>\nVerilen Roller: <@&${kadınrol1}>, <@&${kadınrol2}>`)
    .setFooter(`Toplam Kayıt Sayınız: ${toplamkayıt ? `${toplamkayıt}`: "0"}\nKadın Kayıt Sayınız: ${kadınab ? `${kadınab}`: "0"}`)
                
     message.channel.send(schawn2)
    .then(x => x.delete({ timeout: 5000 }))

  savelogg.send(new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
      .setDescription(`• Yetkili: ${message.author}\n• Kayıt Yapılan Kullanıcı: ${kullanici}\n• Güncel İsmi: **${tagcım} ${ad} | ${yas}**\n• Verilen Roller: <@&${kadınrol1}>, <@&${kadınrol2}> \n• Kayıt Yapılan Kanal: <#${message.channel.id}> \n• Toplam Kayıtlar: **${toplamkayıt}**`)
      .setColor("#65d8c4"));

  genelchatt.send(`${kullanici} Aramıza katıldı! Güzel karşılayın arkadaşı.`)
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["kadın", "k"],
  permLevel: 0
};

exports.help = {
  name: "kadın",
  usage: "kadın"
};  
