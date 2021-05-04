const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json") 
const db = require("quick.db");
const ms = require("parse-ms");
const moment = require('moment');
require("moment-duration-format");
const snekfetch = require("snekfetch");
require("./util/eventLoader.js")(client); 
const fs = require("fs"); 
var Jimp = require("jimp"); 
const { readdirSync } = require('fs');
const { join } = require('path');
const chalk = require('chalk');

var prefix = ayarlar.prefix;   

const log = message => {
  
  console.log(`${message}`); 
};

client.commands = new Discord.Collection(); 
client.aliases = new Discord.Collection(); 
fs.readdir("./komutlar/", (err, files) => {  
  
  if (err) console.error(err); 
  
  log(`${files.length} Botun komutları yüklenecek...`); 
  files.forEach(f => {
    
    let props = require(`./komutlar/${f}`);   
    log(`[KOMUT] | ${props.help.name} Eklendi.`); 
    client.commands.set(props.help.name, props); 
    props.conf.aliases.forEach(alias => {
      
      client.aliases.set(alias, props.help.name); 
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {  
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);  
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {  
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);  
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];  
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }

  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});
client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});
 
//--------------------------BOT-SES--------------------------\\

client.on("ready", () => {
  const seslna = ayarlar.botses;
  client.channels.cache
  .get(seslna)
  .join()
  .catch(err => {
    throw err;
  })
})

//--------------------------BOT-SES--------------------------\\

//--------------------------TAG-ROL--------------------------\\

client.on("userUpdate", async (eski, yeni) => {

 if(eski.username !== yeni.username) {

 let sunucu = ayarlar.sunucuID; // sunucu
 let tag = ayarlar.tag; // tagınız
 let rol = ayarlar.tagrol; // tag alınca verilcek rol
 let çenıl = ayarlar.taglog; // tag alınca gönderilcek kanal

try {
   
// TAG ALAN KULLANICI

if(yeni.username.includes(tag) && !client.guilds.cache
.get(sunucu)
.members.cache.get(yeni.id)
.roles.cache.has(rol)) {

 await client.channels.cache.get(çenıl)
  .send(new Discord.MessageEmbed()
  .setColor("GREEN")
  .setDescription(`${yeni} Adlı Kullanıcı **${tag}** Tagını Aldığı İçin **<@&${rol}>** Rolünü Kazandı!`)
  .setTimestamp())
  
  await client.guilds.cache
  .get(sunucu)
  .members.cache.get(yeni.id)
  .roles.add(rol)
} 

// TAG SALAN KULLANICI

if(!yeni.username.includes(tag) && client.guilds.cache
.get(sunucu)
.members.cache.get(yeni.id)
.roles.cache.has(rol)) {

  await client.channels.cache.get(çenıl)
  .send(new Discord.MessageEmbed()
  .setColor("RED")
  .setDescription(`${yeni} Adlı Kullanıcı **${tag}** Tagını Çıkardığı İçin **<@&${rol}>** Rolünü Kaybetti!`)
  .setTimestamp())

  await client.guilds.cache
  .get(sunucu)
  .members.cache.get(yeni.id)
  .roles.remove(rol)
}
 } catch (err) {
  console.log(err)
  } 
}
})

//--------------------------TAG-ROL--------------------------\\

//--------------------------KAYIT-SİSTEMİ--------------------------\\

client.on("guildMemberAdd", member => {

  let yetkilicik = ayarlar.yetkilirol; // register hammer
  let kayıtkanal = ayarlar.registersohbet; // register chati
  let guild = member.guild; // sunucu

  let kullanici = client.users.cache.get(member.id); // sunucuya gelecek üye

  const kanal = member.guild.channels.cache.find(k => k.id === kayıtkanal); // hoşgeldin mesajını atacak kanal

  let totalaylar = {
    "01": "Ocak",
    "02": "Şubat",
    "03": "Mart",
    "04": "Nisan",
    "05": "Mayıs", 
    "06": "Haziran",
    "07": "Temmuz",
    "08": "Ağustos",
    "09": "Eylül", 
    "10": "Ekim",
    "11": "Kasım",
    "12": "Aralık"
  }
 let aylar = totalaylar

 // güvenlimi şüphelimi kontrol etcek

 const kurls = new Date().getTime() - kullanici.createdAt.getTime();
 const günla = moment.duration(kurls).format("DD")

 var kontrl;

 if(günla > 7) {
  kontrl = "Güvenli <a:schawntik:834484844876398622>"
 } 
 if(günla < 7) {
  kontrl = "Şüpheli <a:schawnxtik:834484837313413120>"
 }

 member.setNickname(`★ İsim | Yaş`) // sunucuya gelen kullanıcının adını İsim Yaş yapar

 kanal.send(`

<a:valeria:838862022123978773> Valeria'ya hoşgeldin ${member} | (\`${member.id}\`) hesabın \`${moment(kullanici.createdAt).format("DD")} ${aylar[moment(kullanici.createdAt).format('MM')]} ${moment(kullanici.createdAt).format('YYYY HH:mm:ss')}\`'de oluşturulmuş ve hesabın **${kontrl}**

  <a:valeria:838862022123978773>  Seninle beraber **${guild.memberCount}** kişi olduk!

    <a:valeria:838862022123978773>  Kayıt olmak için ses odalarından birine geçip **<@&${yetkilicik}>** rolündeki yetkililere teyit vererek kayıt olabilirsin.

  <a:valeria:838862022123978773>  Sunucumuzun (\`★\`) tagını alarak ailemizden biri olabilirsin.

<a:valeria:838862022123978773> Keyifli vakitler dileriz, bu arada <#832269433137004544> kısmına göz atarsan seviniriz.`)
  
 setTimeout(() => {
  client.channels.cache
  .get(kayıtkanal)
  .send(`||<@&${yetkilicik}>||`)  
 },3000)
})

//--------------------------KAYIT-SİSTEMİ--------------------------\\

//--------------------------OTOROL--------------------------\\

client.on("guildMemberAdd", member => {
  let kayıtsızımabi = ayarlar.kayıtsızrol;
  member.roles.add(kayıtsızımabi);
})  

//--------------------------OTOROL--------------------------\\

//--------------------------ŞÜPHELİ-HESAP--------------------------\

client.on('guildMemberAdd', async member => {
  let kullanici = client.users.get(member.id);

  const tarih = new Date().getTime() - kullanici.createdAt.getTime();
  if (tarih < 60480001656)

  member.roles.add("832269310834638858") // şüpheli rol ID
  member.roles.remove("832269334625648701") // kayıtsız rol ID
});

//--------------------------ŞÜPHELİ-HESAP--------------------------\

client.login(process.env.token);