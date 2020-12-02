require("dotenv").config()
const fetch = require('node-fetch')
const Discord = require("discord.js")
const Client = new Discord.Client()

const BOT_PREFIX = "!"
const GACHA_ROLE_ID = "783730257097261106"
const BOT_ERROR_MESSAGE = "An error? Seems something broke senpai. This is the closest you'll get to mind breaking me~"

const GOOGLE_SHEETS_URL_VIDEOS = "https://spreadsheets.google.com/feeds/list/1j3ty_LIcJDKWDd_0jibinOWpHQGgGWMTPMf7Lk_qVHk/1/public/values?alt=json"
const GOOGLE_SHEETS_URL_IMAGES = "https://spreadsheets.google.com/feeds/list/1z6taNY-TTzICxDE1-FqA8jGClbHPJPomGcMKMCwU1RE/1/public/values?alt=json"

Client.on("ready", () => {
    console.log("Logged into discord succesfully.")
})

Client.login(process.env.BOT_TOKEN)

Client.on("message", msg => {
    if (msg.channel.id === "649396824414617614") {
        if (msg.content.charAt(0) === BOT_PREFIX) {
            if (msg.member.id !== "783724643059105853") {
                msg.react("✅")
            }

            commandRouter(msg)
        }
    }
})

function commandRouter(msg) {
    // remove all excess spaces from string and put in array
    let command = msg.content.split(" ")
    temp = [];
    for (let i of command) {
        i && temp.push(i); // copy each non-empty value to the 'temp' array
    }
    command = temp

    // remove command prefix
    command[0] = command[0].substring(1)

    switch (command[0]) {
        case "coin":
            handleCoin(msg, command)
            break;
        case "spin":
            handleSpin(msg, command)
            break;
        case "mycoins":
            handleMyCoins(msg, command)
            break;
        default:
            msg.reply("There are three commands, how did you mess this one up senpai?")
            break;
    }

    // if (msg.content == `${BOT_PREFIX}gacha`) {
    //     let hasRole = false
    //     msg.member.roles.cache.forEach(role => {
    //         if (role.id === GACHA_ROLE_ID) {
    //             hasRole = true
    //         }
    //     })
    //     if (hasRole) {
    //         deleteRoleGacha(msg.member)
    //     } else {
    //         addRoleGacha(msg.member)
    //     }

    //     msg.reply("OK nerd")
    // }
}

async function handleSpin(msg, command) {
    let videoCount = 0
    let rest
    let freeChoiceCount = 0
    let tenVideoCount = 0
    let priceMessage
    let prizeMoney

    // go through all videos and get the 
    let videos = await getVideos()
    let images = await getImages()

    Object.keys(videos.feed.entry).map((id) => {
        if (videos.feed.entry[id]["gsx$totalremaining"] !== undefined) {
            if (videos.feed.entry[id]["gsx$totalremaining"]["$t"] != "0") {
                videoCount++
            }
        }
    })

    rest = videoCount % 10
    tenVideoCount = videoCount - rest

    for (let index = 0; index < tenVideoCount; index = index + 10) {
        if (tenVideoCount !== index) {
            freeChoiceCount++
        }
    }

    maxVideoNumber = freeChoiceCount + videoCount

    // 101 because javascript is dumb
    let priceNumber = Math.floor(Math.random() * 101)

    // number of unfinished funded videos+1, +1 for every 10 videos (free choice)
    // (i cant english for whatever reason)
    let videoNumber = Math.floor(Math.random() * maxVideoNumber);

    switch (true) {
        case (priceNumber <= 5):
            priceMessage = `00${priceNumber}? That roll's even smaller than your dick senpai~`
            break;
        case (priceNumber >= 6 && priceNumber <= 20):
            priceMessage = "Senpai, this isn't golf you know? You want the highest number possible."
            break;
        case (priceNumber >= 21 && priceNumber <= 40):
            priceMessage = "About as expected from you senpai...\nHopelessly mediocre."
            break;
        case (priceNumber >= 41 && priceNumber <= 50):
            priceMessage = "Good job senpai~ You almost got more than the bare minimum prize!"
            break;
        case (priceNumber >= 51 && priceNumber <= 60):
            priceMessage = "A whole $9. Don't tell me you're actually pleased with that?"
            break;
        case (priceNumber >= 61 && priceNumber <= 68 || priceNumber == 70):
            priceMessage = "Careful senpai, you're getting close to actually achieving something!"
            break;
        case (priceNumber == 69):
            priceMessage = "Well this is probably the only 69 you'll ever experience. I hope you enjoyed it~"
            break;
        case (priceNumber >= 71 && priceNumber <= 80):
            priceMessage = "Ehhh, you're in top 30%? This must be a first for you, I'm very proud~"
            break;
        case (priceNumber >= 81 && priceNumber <= 90):
            priceMessage = "Soooo close to a real prize there. Better luck next time."
            break;
        case (priceNumber >= 91 && priceNumber <= 94):
            priceMessage = "I'm guessing the one positive attribute you have is luck. Congratulations senpai~"
            break;
        case (priceNumber >= 95 && priceNumber <= 98):
            priceMessage = "I know 1/20 rolls will be at least this good, but I still wasn't expecting YOU to do it. Congratulations."
            break;
        case (priceNumber == 99):
            priceMessage = "Somebody is lucky today~ Want to push that luck? I can give you a new denial roulette~"
            break;
        case (priceNumber == 100):
            priceMessage = "Jackpot? Jackpot! Congratulations senpai! This must be the crowning moment of your life. How does it feel?"
            break;
        case (priceNumber >= 1 && priceNumber <= 100):
        break;
        default:
            priceMessage = BOT_ERROR_MESSAGE
        break;
    }
    
    switch (true) {
        case (priceNumber >= 1 && priceNumber <= 50):
            prizeMoney = 6
        break;
        case (priceNumber >= 51 && priceNumber <= 70):
            prizeMoney = 9
        break;
        case (priceNumber >= 71 && priceNumber <= 80):
            prizeMoney = 12
        break;
        case (priceNumber >= 81 && priceNumber <= 90):
            prizeMoney = 15
        break;
        case (priceNumber >= 91 && priceNumber <= 92):
            prizeMoney = 25
        break;
        case (priceNumber >= 93 && priceNumber <= 94):
            prizeMoney = 35
        break;
        case (priceNumber >= 95 && priceNumber <= 96):
            prizeMoney = 45
        break;
        case (priceNumber >= 97 && priceNumber <= 98):
            prizeMoney = 55
        break;
        case (priceNumber == 99):
            prizeMoney = 69
        break;
        case (priceNumber == 100):
            prizeMoney = 100
        break;
        default:
            prizeMoney = BOT_ERROR_MESSAGE
        break;
    }

    if (videos.feed.entry[videoNumber].title["$t"] == undefined) {
        videoName = "FREE CHOICE!"
    } else {
        videoName = videos.feed.entry[videoNumber].title["$t"]
    }
    
    image = "https://" + images.feed.entry[priceNumber].content["$t"].split("https://")[1]

    const attachment = new Discord.MessageAttachment(image)

    const embedMessage = new Discord.MessageEmbed()
        .setColor('#fe0199')
        .setDescription(`
            ${priceMessage}\n
            You get $${prizeMoney} to ${videoName}
        `)

    await msg.channel.send(attachment)
    msg.channel.send(embedMessage)
}

function handleCoin(msg, command) {
    msg.channel.send("PADORU PADORUUUUUUUUUU")
}

function addRoleGacha(member) {
    member.roles.add(GACHA_ROLE_ID)
}

function deleteRoleGacha(member) {
    member.roles.remove(GACHA_ROLE_ID)
}

async function getVideos() {
    let response = await fetch(GOOGLE_SHEETS_URL_VIDEOS);

    if (response.ok) {
        json = await response.json();
    }

    return json // parses JSON response into native JavaScript objects
}

async function getImages() {
    let response = await fetch(GOOGLE_SHEETS_URL_IMAGES);

    if (response.ok) {
        json = await response.json();
    }

    return json // parses JSON response into native JavaScript objects
}