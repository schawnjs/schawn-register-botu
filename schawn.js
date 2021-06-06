const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json") 
const db = require("quick.db");
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

client.on("userUpdate", async (eskiKullanici, yeniKullanici) => {

 if(eskiKullanici.username !== yeniKullanici.username) {

 let sunucu = ayarlar.sunucuID; // sunucu
 let tag = ayarlar.tag; // tagınız
 let rol = ayarlar.tagrol; // tag alınca verilcek rol
 let çenıl = ayarlar.taglog; // tag alınca gönderilcek kanal

try {
   
// TAG ALAN KULLANICI

if(yeniKullanici.username.includes(tag) && !client.guilds.cache
.get(sunucu)
.members.cache.get(yeniKullanici.id)
.roles.cache.has(rol)) {

 await client.channels.cache.get(çenıl)
  .send(new Discord.MessageEmbed()
  .setColor("GREEN")
  .setDescription(`${yeniKullanici} Adlı Üye \`${tag}\` Tagını Aldığı İçin **<@&${rol}>** Rolünü Kazandı!`)
  .setTimestamp())
  
  await client.guilds.cache
  .get(sunucu)
  .members.cache.get(yeniKullanici.id)
  .roles.add(rol)
} 

// TAG SALAN KULLANICI

if(!yeniKullanici.username.includes(tag) && client.guilds.cache
.get(sunucu)
.members.cache.get(yeniKullanici.id)
.roles.cache.has(rol)) {

  await client.channels.cache.get(çenıl)
  .send(new Discord.MessageEmbed()
  .setColor("RED")
  .setDescription(`${yeniKullanici} Adlı Üye \`${tag}\` Tagını Çıkardığı İçin **<@&${rol}>** Rolünü Kaybetti!`)  
  .setTimestamp())

  await client.guilds.cache
  .get(sunucu)
  .members.cache.get(yeniKullanici.id)
  .roles.remove(rol)
}
 } catch (err) {
  console.log(err)
   } 
  }
});

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
 const gecn = moment.duration(kurls).format("Y [yıl], MM [ay], DD [gün] önce")

 var kontrl;

 if(kurls > 1296000000) { kontrl = "Güvenli <a:schawntik:834484844876398622>" } 
 if(kurls < 1296000000) { kontrl = "Şüpheli <a:schawnxtik:834484837313413120>" }

 kanal.send(`

Lawertz'e hoşgeldin ${member} - (\`${member.id}\`) seninle beraber **${guild.memberCount}** kişi olduk.

  Hesabın \`${moment(kullanici.createdAt).format("DD")} ${aylar[moment(kullanici.createdAt).format("MM")]} ${moment(kullanici.createdAt).format("YYYY")} saat ${moment(kullanici.createdAt).format("HH:mm:ss")}\`'de oluşturulmuş (\`${gecn}\`) ve hesabın **${kontrl}**

    Kayıt olmak için ses odalarından birine geçip **<@&${yetkilicik}>** rolündeki yetkililere teyit vererek kayıt olabilirsin.

  Sunucumuzun (\`ተ\`) tagını alarak ailemizden biri olabilirsin. İyi eğlenceler dileriz...`)
  
 setTimeout(() => {
  client.channels.cache
  .get(kayıtkanal)
  .send(`<@&${yetkilicik}>`)  
 },3000)
});

//--------------------------KAYIT-SİSTEMİ--------------------------\\

//--------------------------OTOROL--------------------------\\

client.on("guildMemberAdd", schawnoa => {
  let kayıtsz = ayarlar.kayıtsızrol;
  schawnoa.setNickname("• İsim | Yaş") // sunucuya gelen kullanıcının adını • İsim | Yaş yapar
  schawnoa.roles.add(kayıtsz);
});  

//--------------------------OTOROL--------------------------\\

//--------------------------TAG-KONTROL--------------------------\\

client.on("guildMemberAdd", member => {
  
 let tag = ayarlar.tag;
 let sunucu = ayarlar.sunucuID;
 let rolcm = ayarlar.tagrol;

 if(member.user.username.includes(tag)) // eğer kullanıcının adında tag varsa 
 member.roles.add(rolcm) // tag rolünü verior

 const oa = new Discord.MessageEmbed()
  .setColor(rolcm.hexColor)
  .setDescription(`${member} Aramıza Taglı olarak Katıldı.`)
  .setTimestamp()
  
  client.channels.cache
  .get(ayarlar.taglog)
  .send(oa)
});

//--------------------------TAG-KONTROL--------------------------\\

//--------------------------YASAKLI-TAG--------------------------\\

client.on("guildMemberAdd", member => {

  let yasakli = ["★"] // yasaklı tagları buraya yazin
  
  if(member.user.username.includes(yasakli)) {
    member.kick()
    member.send("Dostum İsmindeki Yasaklı Tag'dan Dolayı \`★\` Sunucudan Kicklendin Tagı Çıkarıp Tekrar Gelirsen Kayıt Olabilirsin.")
  }
});

//--------------------------YASAKLI-TAG--------------------------\\

client.login(process.env.token);