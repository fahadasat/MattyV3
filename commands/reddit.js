/*
This command will post a from reddit
*/

const snekfetch = require("snekfetch");
const Discord = require("discord.js");
const advice = [
  "AskMen",
  "howtonotgiveafuck",
  "DoesAnybodyElse",
  "askscience",
  "AskReddit",
  "lifehacks",
  "tipofmytongue",
  "AskWomen",
  "offmychest",
  "tifu",
  "relationship_advice",
  "self",
  "LifeProTips",
  "IAmA",
  "philosophy",
  "todayilearned",
  "explainlikeimfive",
  "confession",
];
const animals = [
  "NatureIsFuckingLit",
  "AnimalsBeingJerks",
  "cats",
  "AnimalsBeingBros",
  "likeus",
  "aww",
  "AnimalsBeingDerps",
  "rarepuppers",
  "dogs",
  "Awwducational",
];
const art = [
  "ArtefactPorn",
  "Graffiti",
  "reallifedoodles",
  "SketchDaily",
  "Design",
  "manga",
  "tattoos",
  "drawing",
  "Art",
  "redditgetsdrawn",
];
const diy = [
  "knitting",
  "gardening",
  "DIY",
  "Homebrewing",
  "homeautomation",
  "buildapc",
  "homestead",
  "woodworking",
  "HomeImprovement",
  "crafts",
  "lifehacks",
  "howto",
  "somethingimade",
];
const electronics = [
  "pcmasterrace",
  "iphone",
  "gadgets",
  "mac",
  "battlestations",
  "technology",
  "buildapc",
  "Android",
  "hardware",
  "raspberry_pi",
];
const entertainment = [
  "horror",
  "television",
  "podcasts",
  "Documentaries",
  "movies",
  "entertainment",
  "Music",
  "Celebs",
  "scifi",
  "boardgames",
];
const fashion = [
  "streetwear",
  "SkincareAddiction",
  "frugalmalefashion",
  "ThriftStoreHauls",
  "Sneakers",
  "femalefashionadvice",
  "AsianBeauty",
  "MakeupAddiction",
  "Watches",
  "malefashionadvice",
];
const food = [
  "EatCheapAndHealthy",
  "shittyfoodporn",
  "food",
  "slowcooking",
  "FoodPorn",
  "Cooking",
  "foodhacks",
  "GifRecipes",
  "MealPrepSunday",
  "recipes",
];
const funny = [
  "Jokes",
  "nottheonion",
  "facepalm",
  "humor",
  "dadjokes",
  "Showerthoughts",
  "ChildrenFallingOver",
  "reactiongifs",
  "ContagiousLaughter",
  "funny",
];
const gaming = [
  "wiiu",
  "GamePhysics",
  "nintendo",
  "truegaming",
  "ShouldIbuythisgame",
  "pcgaming",
  "xboxone",
  "PS4",
  "gaming",
];
const health = [
  "ADHD",
  "Health",
  "bodybuilding",
  "Fitness",
  "keto",
  "progresspics",
  "loseit",
  "GetMotivated",
  "bodyweightfitness",
  "Boxing",
];
const memes = [
  "BlackPeopleTwitter",
  "WhitePeopleTwitter",
  "me_irl",
  "wholesomememes",
  "madlads",
  "memes",
  "funny",
  "AdviceAnimals",
  "trippinthroughtime",
  "MurderedByAOC",
  "PrequelMemes",
  "PoliticalHumor",
  "tumblr",
  "HolUp",
];
const music = [
  "mashups",
  "kpop",
  "WeAreTheMusicMakers",
  "Metal",
  "electronicmusic",
  "hiphopheads",
  "classicalmusic",
  "EDM",
  "audiophile",
  "Music",
  "indieheads",
  "listentothis",
];
const news = [
  "PoliticalDiscussion",
  "worldnews",
  "UpliftingNews",
  "savedyouaclick",
  "gamernews",
  "nottheonion",
  "news",
  "subredditoftheday",
  "worldpolitics",
  "politics",
];
const outdoors = [
  "Outdoors",
  "skiing",
  "Survival",
  "MTB",
  "climbing",
  "camping",
  "hiking",
  "snowboarding",
  "CampingandHiking",
  "Fishing",
  "vandwellers",
  "homestead",
  "gardening",
];
const photography = [
  "itookapicture",
  "wallpaper",
  "EarthPorn",
  "photocritique",
  "HistoryPorn",
  "MachinePorn",
  "ExposurePorn",
  "analog",
  "PerfectTiming",
  "Filmmakers",
  "photography",
  "astrophotography",
];
const pics_gifs = [
  "gifs",
  "pics",
  "mildlyinfuriating",
  "photoshopbattles",
  "interestingasfuck",
  "BetterEveryLoop",
  "oddlysatisfying",
  "wheredidthesodago",
  "woahdude",
  "Cinemagraphs",
  "mildlyinteresting",
];
const relationships = [
  "raisedbynarcissists",
  "relationship_advice",
  "relationships",
  "Parenting",
  "Tinder",
  "JUSTNOMIL",
  "dating_advice",
  "ForeverAlone",
  "socialskills",
  "childfree",
];
const science = [
  "compsci",
  "nasa",
  "space",
  "askscience",
  "biology",
  "Astronomy",
  "MachineLearning",
  "chemistry",
  "shittyaskscience",
  "science",
  "math",
  "Physics",
];
const sports = [
  "CFB",
  "snowboarding",
  "nfl",
  "formula1",
  "baseball",
  "nba",
  "soccer",
  "hockey",
  "tennis",
  "sports",
  "bicycling",
  "NASCAR",
  "running",
  "MMA",
  "skiing",
  "Gold",
  "CollegeBasketball",
];
const tv = [
  "thewalkingdead",
  "breakingbad",
  "NetflixBestOf",
  "gameofthrones",
  "rickandmorty",
  "television",
  "familyguy",
  "westworld",
  "southpark",
  "futurama",
];
const tech = [
  "Bitcoin",
  "gadgets",
  "pcmasterrace",
  "programming",
  "google",
  "InternetIsBeautiful",
  "javascript",
  "hacking",
  "technology",
  "learnprogramming",
  "techsupport",
  "apple",
];
const travel = [
  "urbanexploration",
  "IWantOut",
  "solotravel",
  "JapanTravel",
  "digitalnomad",
  "roadtrip",
  "travel",
  "Shoestring",
  "vagabond",
  "backpacking",
];
const video_games = [
  "leagueoflegends",
  "zelda",
  "KerbalSpaceProgram",
  "wow",
  "PUBATTLEGROUNDS",
  "Overwatch",
  "DestinyTheGame",
  "Minecraft",
  "hearthstone",
  "pokemongo",
];
const videos = [
  "youtubehaiku",
  "Whatcouldgowrong",
  "Roadcam",
  "mealtimevideos",
  "nonononoyes",
  "BestOfStreamingVideo",
  "PublicFreakout",
  "ArtisanVideos",
  "yesyesyesyesno",
  "instant_regret",
  "videos",
  "DeepIntoYouTube",
  "nononono",
];
const vroom = [
  "AutoDetailing",
  "Autos",
  "Justrolledintotheshop",
  "aviation",
  "Shitty_Car_Mods",
  "motorcycles",
  "teslamotors",
  "cars",
  "carporn",
  "MechanicAdvice",
];
const writing = [
  "writing",
  "FreeEBOOKS",
  "Fantasy",
  "books",
  "suggestmeabook",
  "Poetry",
  "Screenwriting",
  "comicbooks",
  "literature",
  "WritingPrompts",
];
let nsfw = [
  "nsfw",
  "nsfw2",
  "TipOfMyPenis",
  "bonermaterial",
  "porn",
  "nsfw411",
  "iWantToFuckHer",
  "exxxtras",
  "distension",
  "bimbofetish",
  "christiangirls",
  "cuckold",
  "dirtygaming",
  "sexybutnotporn",
  "femalepov",
  "omgbeckylookathiscock",
  "sexygirls",
  "breedingmaterial",
  "canthold",
  "toocuteforporn",
  "justhotwomen",
  "realsexyselfies",
  "stripgirls",
  "hotstuffnsfw",
  "uncommonposes",
  "gifsofremoval",
  "nostalgiafapping",
  "jizzedtothis",
  "verticalgifs",
  "pantyslide",
  "pornogram",
  "oilporn",
  "bisexy",
  "riskyporn",
  "milf",
  "gonewild30plus",
  "preggoporn",
  "realmoms",
  "legalteens",
  "collegesluts",
  "adorableporn",
  "legalteensXXX",
  "gonewild18",
  "just18",
  "PornStarletHQ",
  "fauxbait",
  "realgirls",
  "amateur",
  "homemadexxx",
  "dirtypenpals",
  "FestivalSluts",
  "CollegeAmateurs",
  "amateurcumsluts",
  "nsfw_amateurs",
  "funwithfriends",
  "randomsexiness",
  "amateurporn",
  "normalnudes",
  "Camwhores",
  "camsluts",
  "streamersgonewild",
  "GoneWild",
  "PetiteGoneWild",
  "gonewildstories",
  "GoneWildTube",
  "treesgonewild",
  "gonewildaudio",
  "GWNerdy",
  "gonemild",
  "altgonewild",
  "gifsgonewild",
  "analgw",
  "gonewildsmiles",
  "onstageGW",
  "RepressedGoneWild",
  "bdsmgw",
  "UnderwearGW",
  "LabiaGW",
  "TributeMe",
  "WeddingsGoneWild",
  "gwpublic",
  "assholegonewild",
  "leggingsgonewild",
  "dykesgonewild",
  "goneerotic",
  "snapchatgw",
  "gonewildhairy",
  "gonewildtrans",
  "gonwild",
  "ratemynudebody",
  "gonewildhairy",
  "rule34",
  "ecchi",
  "futanari",
  "doujinshi",
  "yiff",
  "monstergirl",
  "mechanicalsluts",
  "hentai",
  "hentai_gif",
  "WesternHentai",
  "hentai_irl",
  "artistic_hentai",
  "hentaibeast",
  "hentaihumiliation",
  "traphentai",
  "guro",
  "ahegao",
  "ahegao_irl",
  "hypnohentai",
  "tentai",
  "handholding",
  "honeyfuckers",
  "itshiptofuckbees",
  "guro",
  "hentaibondage",
  "animeshorts",
  "kuroihada",
  "disgustedanimegirls",
  "buttfangs",
  "yuri",
  "hentaibondage",
  "ZettaiRyouiki",
  "hentaifemdom",
  "animefeet",
  "thighhighhentai",
  "animebooty",
  "swimsuithentai",
  "animelegs",
  "animearmpits",
  "animemidriff",
  "skindentation",
  "thighdeology",
  "chiisaihentai",
  "lovelivelewds",
  "bokunoeroacademia",
  "waifusgonewild",
  "sideoppai",
  "ass",
  "asstastic",
  "facedownassup",
  "assinthong",
  "bigasses",
  "buttplug",
  "TheUnderbun",
  "booty",
  "pawg",
  "paag",
  "cutelittlebutts",
  "hipcleavage",
  "frogbutt",
  "HungryButts",
  "cottontails",
  "lovetowatchyouleave",
  "celebritybutts",
  "cosplaybutts",
  "mooning",
  "boobies",
  "TittyDrop",
  "boltedontits",
  "boobbounce",
  "boobs",
  "downblouse",
  "homegrowntits",
  "cleavage",
  "breastenvy",
  "youtubetitties",
  "torpedotits",
  "thehangingboobs",
  "page3glamour",
  "biggerthanyouthought",
  "sarah_xxx",
  "remylacroix",
  "Anjelica_Ebbi",
  "BlancNoir",
  "rileyreid",
  "dollywinks",
  "tessafowler",
  "lilyivy",
  "funsizedasian",
  "mycherrycrush",
  "gillianbarnes",
  "kawaiikitten",
  "emilybloom",
  "legendarylootz",
  "sexyflowerwater",
  "miamalkova",
  "sashagrey",
  "keriberry_420",
  "justpeachyy",
  "angelawhite",
  "miakhalifa",
  "alexapearl",
  "missalice_18",
  "lanarhoades",
  "evalovia",
  "GiannaMichaels",
  "arianamarie",
];

let timer = [];

module.exports = {
  name: "reddit",
  aliases: ["red", "redit"],
  description: "Sends you an image from the subreddit.",
  argumentDescription:
    "The desired subreddit or category. The second argument is a [yes/no]",
  // roles: ["Admin", "Mod", "Student"],
  args: false,
  usage: "[subreddit/category] [is this a subreddit]",
  guildOnly: true,
  cooldown: 5,
  category: "Misc",
  async execute(message, args) {
    try {
      if (!args.length)
        return message.reply(
          "You need to provide a subreddit or choose a category from the list: \nadvice\nanimals\nart\ndiy\nelectronics\nentertainment\nfashion\nfood\nfunny\ngaming\nhealthmemesmusic\newsoutdoors\nphotography\npics_gifs\nrelationships\nscience\nsports\ntv\ntech\ntravel\nvideo_games\nvideos\nvroom\nwriting\nnsfw"
        );
      if (args[0] === "stop") {
        try {
          //stop the loop
          clearInterval(
            timer.find((object) => object.channelId === message.channel.id)
              .function
          );

          //find index of object
          let index = timer.findIndex(
            (object) => object.channelId === message.channel.id
          );

          //remove the object from array
          timer.splice(index, 1);

          return message.reply("Loop stopped.");
        } catch (error) {
          return message.reply("There isn't a  loop in this channel.");
        }
      }
      if (
        args.length > 3 ||
        (args[1].toLowerCase() !== "yes" && args[1].toLowerCase() !== "no")
      )
        return message.reply(
          "The second argument needs to be a yes if your argument is a subreddit or no if its a category."
        );

      //delete the message so it doesnt clutter
      message.delete();

      //yes means they are providing the subreddit, no means choose a subreddit from the category they are suppliying
      if (args[1].toLowerCase() === "yes") {
        try {
          if (args.length > 2 && args[2].toLowerCase() === "loop") {
            //create a setInterval to loop the function and insert it into the global
            //array so it can be deleted when the user asks

            //check if there is already a loop in this channel
            if (
              timer.filter((object) => object.channelId === message.channel.id)
                .length > 0
            )
              return message.reply("There is already a loop in this channel.");
            else {
              timer.push({
                channelId: message.channel.id,
                function: setInterval(
                  () => this.returnQuery(args[0], message),
                  60 * 60 * 1000 //1 hour
                ),
              });
              // return message.reply("Loop started in this channel.");
            }
          } else this.returnQuery(args[0], message);
        } catch (error) {
          console.log(error);
          return message.reply("Incorrect subreddit");
        }
      } else {
        try {
          if (args.length > 2 && args[2].toLowerCase() === "loop") {
            //create a setInterval to loop the function and insert it into the global
            //array so it can be deleted when the user asks

            //check if there is already a loop in this channel
            if (
              timer.filter((object) => object.channelId === message.channel.id)
                .length > 0
            )
              return message.reply("There is already a loop in this channel.");
            else {
              timer.push({
                channelId: message.channel.id,
                function: setInterval(() => {
                  let subreddit = eval(args[0])[
                    Math.floor(Math.random() * eval(args[0]).length)
                  ];
                  this.returnQuery(subreddit, message);
                }, 60 * 60 * 1000),
              });
              // return message.reply("Loop started in this channel.");
            }
          } else {
            let subreddit = eval(args[0])[
              Math.floor(Math.random() * eval(args[0]).length)
            ];
            this.returnQuery(subreddit, message);
          }
        } catch (err) {
          return message.reply("Incorrect category");
        }
      }
    } catch (err) {
      message.reply("Couldn't provide a post.");
      return console.log(err);
    }
  },

  returnQuery: async function (subreddit, message) {
    //get reddit query result
    const { body } = await snekfetch
      .get(`https://www.reddit.com/r/${subreddit}.json?sort=top&t=week`)
      .query({ limit: 800 });

    //used to see if the channel has nsfw on
    const allowed = message.channel.nsfw
      ? body.data.children
      : body.data.children.filter((post) => !post.data.over_18);

    //if there arent any children then there hasnt been any posts
    if (!allowed.length)
      return message.channel.send("We couldn't find any posts sorry.");

    //get a random number from the children
    const randomnumber = Math.floor(Math.random() * allowed.length);

    //if the post is an image then send it in an embed, else just post the link
    if (
      allowed[randomnumber].data.url.endsWith("jpg") ||
      allowed[randomnumber].data.url.endsWith("png")
    ) {
      const embed = new Discord.MessageEmbed()
        .setURL(
          `https://www.reddit.com/${allowed[randomnumber].data.permalink}`
        )
        .setColor(0x00a2e8)
        .setTitle(allowed[randomnumber].data.title)
        .setDescription("Posted by: u/" + allowed[randomnumber].data.author)
        .setImage(allowed[randomnumber].data.url)
        .addField(
          "Other info:",
          "Up votes: " +
            allowed[randomnumber].data.ups +
            " / Comments: " +
            allowed[randomnumber].data.num_comments
        )
        .setFooter(
          `Provided by ${allowed[randomnumber].data.subreddit_name_prefixed}`
        );
      return message.channel.send(embed);
    }
    return message.channel.send(allowed[randomnumber].data.url);
  },
};
