/*
This command will reply a joke to the user
*/

const Discord = require("discord.js");

const jokes = [
  {
    id: 1,
    setup: "What did the fish say when it hit the wall?",
    punchline: "Dam.",
  },
  {
    id: 2,
    setup: "How do you make a tissue dance?",
    punchline: "You put a little boogie on it.",
  },
  {
    id: 3,
    setup: "What's Forrest Gump's password?",
    punchline: "1Forrest1",
  },
  {
    id: 4,
    setup: "What do you call a belt made out of watches?",
    punchline: "A waist of time.",
  },
  {
    id: 5,
    setup: "Why can't bicycles stand on their own?",
    punchline: "They are two tired",
  },
  {
    id: 6,
    setup: "How does a train eat?",
    punchline: "It goes chew, chew",
  },
  {
    id: 7,
    setup: "What do you call a singing Laptop",
    punchline: "A Dell",
  },
  {
    id: 8,
    setup: "How many lips does a flower have?",
    punchline: "Tulips",
  },
  {
    id: 9,
    setup: "How do you organize an outer space party?",
    punchline: "You planet",
  },
  {
    id: 10,
    setup: "What kind of shoes does a thief wear?",
    punchline: "Sneakers",
  },
  {
    id: 11,
    setup: "What's the best time to go to the dentist?",
    punchline: "Tooth hurty.",
  },
  {
    id: 12,
    setup:
      "Knock knock. \n Who's there? \n A broken pencil. \n A broken pencil who?",
    punchline: "Never mind. It's pointless.",
  },
  {
    id: 13,
    setup: "Knock knock. \n Who's there? \n Cows go. \n Cows go who?",
    punchline: "No, cows go moo.",
  },
  {
    id: 14,
    setup:
      "Knock knock. \n Who's there? \n Little old lady. \n Little old lady who?",
    punchline: "I didn't know you could yodel!",
  },
  {
    id: 15,
    setup: "What's the best thing about a Boolean?",
    punchline: "Even if you're wrong, you're only off by a bit.",
  },
  {
    id: 16,
    setup: "What's the object-oriented way to become wealthy?",
    punchline: "Inheritance",
  },
  {
    id: 17,
    setup: "Where do programmers like to hangout?",
    punchline: "The Foo Bar.",
  },
  {
    id: 18,
    setup: "Why did the programmer quit his job?",
    punchline: "Because he didn't get arrays.",
  },
  {
    id: 19,
    setup: "Did you hear about the two silk worms in a race?",
    punchline: "It ended in a tie.",
  },
  {
    id: 20,
    setup: "What do you call a laughing motorcycle?",
    punchline: "A Yamahahahaha.",
  },
  {
    id: 21,
    setup: "A termite walks into a bar and says...",
    punchline: "'Where is the bar tended?'",
  },
  {
    id: 22,
    setup: "What does C.S. Lewis keep at the back of his wardrobe?",
    punchline: "Narnia business!",
  },
  {
    id: 23,
    setup: "Why do programmers always mix up Halloween and Christmas?",
    punchline: "Because Oct 31 == Dec 25",
  },
  {
    id: 24,
    setup: "A SQL query walks into a bar, walks up to two tables and asks...",
    punchline: "'Can I join you?'",
  },
  {
    id: 25,
    setup: "How many programmers does it take to change a lightbulb?",
    punchline: "None that's a hardware problem",
  },
  {
    id: 26,
    setup:
      "If you put a million monkeys at a million keyboards, one of them will eventually write a Java program",
    punchline: "the rest of them will write Perl",
  },
  {
    id: 27,
    setup: "['hip', 'hip']",
    punchline: "(hip hip array)",
  },
  {
    id: 28,
    setup: "To understand what recursion is...",
    punchline: "You must first understand what recursion is",
  },
  {
    id: 29,
    setup: "There are 10 types of people in this world...",
    punchline: "Those who understand binary and those who don't",
  },
  {
    id: 30,
    setup: "What did the duck say when he bought lipstick?",
    punchline: "Put it on my bill",
  },
  {
    id: 31,
    setup: "What happens to a frog's car when it breaks down?",
    punchline: "It gets toad away",
  },
  {
    id: 32,
    setup: "did you know the first French fries weren't cooked in France?",
    punchline: "they were cooked in Greece",
  },
  {
    id: 33,
    setup: "Which song would an exception sing?",
    punchline: "Can't catch me - Avicii",
  },
  {
    id: 34,
    setup: "Knock knock. \n Who's there? \n Opportunity.",
    punchline: "That is impossible. Opportunity doesn’t come knocking twice!",
  },
  {
    id: 35,
    setup: "Why do Java programmers wear glasses?",
    punchline: "Because they don't C#",
  },
  {
    id: 36,
    setup: "Why did the mushroom get invited to the party?",
    punchline: "Because he was a fungi.",
  },
  {
    id: 37,
    setup: "Why did the mushroom get invited to the party?",
    punchline: "Because he was a fungi.",
  },
  {
    id: 38,
    setup: "I'm reading a book about anti-gravity...",
    punchline: "It's impossible to put down",
  },
  {
    id: 39,
    setup:
      "If you're American when you go into the bathroom, and American when you come out, what are you when you're in there?",
    punchline: "European",
  },
  {
    id: 40,
    setup: "Want to hear a joke about a piece of paper?",
    punchline: "Never mind...it's tearable",
  },
  {
    id: 41,
    setup: "I just watched a documentary about beavers.",
    punchline: "It was the best dam show I ever saw",
  },
  {
    id: 42,
    setup: "If you see a robbery at an Apple Store...",
    punchline: "Does that make you an iWitness?",
  },
  {
    id: 43,
    setup:
      "A ham sandwhich walks into a bar and orders a beer. The bartender says...",
    punchline: "I'm sorry, we don't serve food here",
  },
  {
    id: 44,
    setup: "Why did the Clydesdale give the pony a glass of water?",
    punchline: "Because he was a little horse",
  },
  {
    id: 45,
    setup: "If you boil a clown...",
    punchline: "Do you get a laughing stock?",
  },
  {
    id: 46,
    setup: "Finally realized why my plant sits around doing nothing all day...",
    punchline: "He loves his pot.",
  },
  {
    id: 47,
    setup: "Don't look at the eclipse through a colander.",
    punchline: "You'll strain your eyes.",
  },
  {
    id: 48,
    setup: "I bought some shoes from a drug dealer.",
    punchline:
      "I don't know what he laced them with, but I was tripping all day!",
  },
  {
    id: 49,
    setup: "Why do chicken coops only have two doors?",
    punchline: "Because if they had four, they would be chicken sedans",
  },
  {
    id: 50,
    setup: "What do you call a factory that sells passable products?",
    punchline: "A satisfactory",
  },
  {
    id: 51,
    setup:
      "When a dad drives past a graveyard: Did you know that's a popular cemetery?",
    punchline: "Yep, people are just dying to get in there",
  },
  {
    id: 52,
    setup: "Why did the invisible man turn down the job offer?",
    punchline: "He couldn't see himself doing it",
  },
  {
    id: 53,
    setup: "How do you make holy water?",
    punchline: "You boil the hell out of it",
  },
  {
    id: 54,
    setup: "I had a dream that I was a muffler last night.",
    punchline: "I woke up exhausted!",
  },
  {
    id: 55,
    setup: "Why is peter pan always flying?",
    punchline: "Because he neverlands",
  },
  {
    id: 56,
    setup: "How do you check if a webpage is HTML5?",
    punchline: "Try it out on Internet Explorer",
  },
  {
    id: 57,
    setup: "What do you call a cow with no legs?",
    punchline: "Ground beef!",
  },
  {
    id: 58,
    setup: "I dropped a pear in my car this morning.",
    punchline: "You should drop another one, then you would have a pair.",
  },
  {
    id: 59,
    setup: "Lady: How do I spread love in this cruel world?",
    punchline: "Random Dude: [...💘]",
  },
  {
    id: 60,
    setup: "A user interface is like a joke.",
    punchline: "If you have to explain it then it is not that good.",
  },
  {
    id: 61,
    setup: "Knock knock. \n Who's there? \n Hatch. \n Hatch who?",
    punchline: "Bless you!",
  },
  {
    id: 62,
    setup: "What do you call sad coffee?",
    punchline: "Despresso.",
  },
  {
    id: 63,
    setup: "Why did the butcher work extra hours at the shop?",
    punchline: "To make ends meat.",
  },
  {
    id: 64,
    setup: "Did you hear about the hungry clock?",
    punchline: "It went back four seconds.",
  },
  {
    id: 65,
    setup: "Well...",
    punchline: "That’s a deep subject.",
  },
  {
    id: 66,
    setup: "Did you hear the story about the cheese that saved the world?",
    punchline: "It was legend dairy.",
  },
  {
    id: 67,
    setup: "Did you watch the new comic book movie?",
    punchline: "It was very graphic!",
  },
  {
    id: 68,
    setup: "I started a new business making yachts in my attic this year...",
    punchline: "The sails are going through the roof.",
  },
  {
    id: 69,
    setup:
      "I got hit in the head by a soda can, but it didn't hurt that much...",
    punchline: "It was a soft drink.",
  },
  {
    id: 70,
    setup: "I can't tell if i like this blender...",
    punchline: "It keeps giving me mixed results.",
  },
  {
    id: 71,
    setup: "I couldn't get a reservation at the library...",
    punchline: "They were fully booked.",
  },
  {
    id: 72,
    setup: "I was gonna tell you a joke about UDP...",
    punchline: "...but you might not get it.",
  },
  {
    id: 73,
    setup: "The punchline often arrives before the set-up.",
    punchline: "Do you know the problem with UDP jokes?",
  },
  {
    id: 74,
    setup: "Why do C# and Java developers keep breaking their keyboards?",
    punchline: "Because they use a strongly typed language.",
  },
  {
    id: 75,
    setup: "What do you give to a lemon in need?",
    punchline: "Lemonaid.",
  },
  {
    id: 76,
    setup: "Never take advice from electrons.",
    punchline: "They are always negative.",
  },
  {
    id: 78,
    setup: "Hey, dad, did you get a haircut?",
    punchline: "No, I got them all cut.",
  },
  {
    id: 79,
    setup: "What time is it?",
    punchline: "I don't know... it keeps changing.",
  },
  {
    id: 80,
    setup:
      'A weasel walks into a bar. The bartender says, "Wow, I\'ve never served a weasel before. What can I get for you?"',
    punchline: "Pop,goes the weasel.",
  },
  {
    id: 81,
    setup: "Bad at golf?",
    punchline: "Join the club.",
  },
  {
    id: 82,
    setup: "Can a kangaroo jump higher than the Empire State Building?",
    punchline: "Of course. The Empire State Building can't jump.",
  },
  {
    id: 83,
    setup: "Can February march?",
    punchline: "No, but April may.",
  },
  {
    id: 84,
    setup: "Can I watch the TV?",
    punchline: "Yes, but don’t turn it on.",
  },
  {
    id: 85,
    setup: "Dad, can you put my shoes on?",
    punchline: "I don't think they'll fit me.",
  },
  {
    id: 86,
    setup: "Did you hear about the bread factory burning down?",
    punchline: "They say the business is toast.",
  },
  {
    id: 87,
    setup: "Did you hear about the chameleon who couldn't change color?",
    punchline: "They had a reptile dysfunction.",
  },
  {
    id: 88,
    setup: "Did you hear about the cheese factory that exploded in France?",
    punchline: "There was nothing left but de Brie.",
  },
  {
    id: 89,
    setup: "Did you hear about the cow who jumped over the barbed wire fence?",
    punchline: "It was udder destruction.",
  },
  {
    id: 90,
    setup: "Did you hear about the guy who invented Lifesavers?",
    punchline: "They say he made a mint.",
  },
  {
    id: 91,
    setup: "Did you hear about the guy whose whole left side was cut off?",
    punchline: "He's all right now.",
  },
  {
    id: 92,
    setup: "Did you hear about the kidnapping at school?",
    punchline: "It's ok, he woke up.",
  },
  {
    id: 93,
    setup: "Did you hear about the Mexican train killer?",
    punchline: "He had loco motives",
  },
  {
    id: 94,
    setup: "Did you hear about the new restaurant on the moon?",
    punchline: "The food is great, but there’s just no atmosphere.",
  },
  {
    id: 95,
    setup: "Did you hear about the runner who was criticized?",
    punchline: "He just took it in stride",
  },
  {
    id: 96,
    setup:
      "Did you hear about the scientist who was lab partners with a pot of boiling water?",
    punchline: "He had a very esteemed colleague.",
  },
  {
    id: 97,
    setup: "Did you hear about the submarine industry?",
    punchline: "It really took a dive...",
  },
  {
    id: 98,
    setup: "Did you hear that David lost his ID in prague?",
    punchline: "Now we just have to call him Dav.",
  },
  {
    id: 99,
    setup:
      "Did you hear that the police have a warrant out on a midget psychic ripping people off?",
    punchline: 'It reads "Small medium at large."',
  },
  {
    id: 100,
    setup: "Did you hear the joke about the wandering nun?",
    punchline: "She was a roman catholic.",
  },
  {
    id: 101,
    setup: "Did you hear the news?",
    punchline:
      "FedEx and UPS are merging. They’re going to go by the name Fed-Up from now on.",
  },
  {
    id: 102,
    setup: "Did you hear the one about the guy with the broken hearing aid?",
    punchline: "Neither did he.",
  },
  {
    id: 103,
    setup: "Did you know crocodiles could grow up to 15 feet?",
    punchline: "But most just have 4.",
  },
  {
    id: 104,
    setup: "What do ghosts call their true love?",
    punchline: "Their ghoul-friend",
  },
  {
    id: 105,
    setup: "Did you know that protons have mass?",
    punchline: "I didn't even know they were catholic.",
  },
  {
    id: 106,
    setup:
      "Did you know you should always take an extra pair of pants golfing?",
    punchline: "Just in case you get a hole in one.",
  },
  {
    id: 107,
    setup: "Do I enjoy making courthouse puns?",
    punchline: "Guilty",
  },
  {
    id: 108,
    setup: "Do you know where you can get chicken broth in bulk?",
    punchline: "The stock market.",
  },
  {
    id: 109,
    setup: "Do you want a brief explanation of what an acorn is?",
    punchline: "In a nutshell, it's an oak tree.",
  },
  {
    id: 110,
    setup: "Ever wondered why bees hum?",
    punchline: "It's because they don't know the words.",
  },
  {
    id: 111,
    setup: "Have you ever heard of a music group called Cellophane?",
    punchline: "They mostly wrap.",
  },
  {
    id: 112,
    setup: "Have you heard of the band 1023MB?",
    punchline: "They haven't got a gig yet.",
  },
  {
    id: 113,
    setup: "Have you heard the rumor going around about butter?",
    punchline: "Never mind, I shouldn't spread it.",
  },
  {
    id: 114,
    setup: "How are false teeth like stars?",
    punchline: "They come out at night!",
  },
  {
    id: 115,
    setup: "How can you tell a vampire has a cold?",
    punchline: "They start coffin.",
  },
  {
    id: 116,
    setup: "How come a man driving a train got struck by lightning?",
    punchline: "He was a good conductor.",
  },
  {
    id: 117,
    setup: "How come the stadium got hot after the game?",
    punchline: "Because all of the fans left.",
  },
  {
    id: 118,
    setup: "How did Darth Vader know what Luke was getting for Christmas?",
    punchline: "He felt his presents.",
  },
  {
    id: 119,
    setup: "How did the hipster burn the roof of his mouth?",
    punchline: "He ate the pizza before it was cool.",
  },
  {
    id: 120,
    setup: "How do hens stay fit?",
    punchline: "They always egg-cercise!",
  },
  {
    id: 121,
    setup: "How do locomotives know where they're going?",
    punchline: "Lots of training",
  },
  {
    id: 122,
    setup: "How do the trees get on the internet?",
    punchline: "They log on.",
  },
  {
    id: 123,
    setup: "How do you find Will Smith in the snow?",
    punchline: " Look for fresh prints.",
  },
  {
    id: 124,
    setup: "How do you fix a broken pizza?",
    punchline: "With tomato paste.",
  },
  {
    id: 125,
    setup: "How do you fix a damaged jack-o-lantern?",
    punchline: "You use a pumpkin patch.",
  },
  {
    id: 126,
    setup: "How do you get a baby alien to sleep?",
    punchline: " You rocket.",
  },
  {
    id: 127,
    setup: "How do you get two whales in a car?",
    punchline: "Start in England and drive West.",
  },
  {
    id: 128,
    setup: "How do you know if there’s an elephant under your bed?",
    punchline: "Your head hits the ceiling!",
  },
  {
    id: 129,
    setup: "How do you make a hankie dance?",
    punchline: "Put a little boogie in it.",
  },
  {
    id: 130,
    setup: "How do you make holy water?",
    punchline: "You boil the hell out of it.",
  },
  {
    id: 131,
    setup: "How do you organize a space party?",
    punchline: "You planet.",
  },
  {
    id: 132,
    setup: "How do you steal a coat?",
    punchline: "You jacket.",
  },
  {
    id: 133,
    setup:
      "How do you tell the difference between a crocodile and an alligator?",
    punchline: "You will see one later and one in a while.",
  },
  {
    id: 134,
    setup: "How does a dyslexic poet write?",
    punchline: "Inverse.",
  },
  {
    id: 135,
    setup: "How does a French skeleton say hello?",
    punchline: "Bone-jour.",
  },
  {
    id: 136,
    setup: "How does a penguin build it’s house?",
    punchline: "Igloos it together.",
  },
  {
    id: 137,
    setup: "How does a scientist freshen their breath?",
    punchline: "With experi-mints!",
  },
  {
    id: 138,
    setup: "How does the moon cut his hair?",
    punchline: "Eclipse it.",
  },
  {
    id: 139,
    setup: "How many apples grow on a tree?",
    punchline: "All of them!",
  },
  {
    id: 140,
    setup: "How many bones are in the human hand?",
    punchline: "A handful of them.",
  },
  {
    id: 141,
    setup: "How many hipsters does it take to change a lightbulb?",
    punchline:
      "Oh, it's a really obscure number. You've probably never heard of it.",
  },
  {
    id: 142,
    setup: "How many kids with ADD does it take to change a lightbulb?",
    punchline: "Let's go ride bikes!",
  },
  {
    id: 143,
    setup: "How many optometrists does it take to change a light bulb?",
    punchline: "1 or 2? 1... or 2?",
  },
  {
    id: 144,
    setup: "How many seconds are in a year?",
    punchline: "12. January 2nd, February 2nd, March 2nd, April 2nd.... etc",
  },
  {
    id: 145,
    setup: "How many South Americans does it take to change a lightbulb?",
    punchline: "A Brazilian",
  },
  {
    id: 146,
    setup: "How many tickles does it take to tickle an octopus?",
    punchline: "Ten-tickles!",
  },
  {
    id: 147,
    setup: "How much does a hipster weigh?",
    punchline: "An instagram.",
  },
  {
    id: 148,
    setup: "How was the snow globe feeling after the storm?",
    punchline: "A little shaken.",
  },
  {
    id: 149,
    setup: "Is the pool safe for diving?",
    punchline: "It deep ends.",
  },
  {
    id: 150,
    setup: "Is there a hole in your shoe?",
    punchline: "No… Then how’d you get your foot in it?",
  },
  {
    id: 151,
    setup: "What did the spaghetti say to the other spaghetti?",
    punchline: "Pasta la vista, baby!",
  },
  {
    id: 152,
    setup: "What’s 50 Cent’s name in Zimbabwe?",
    punchline: "200 Dollars.",
  },
  {
    id: 153,
    setup: "Want to hear a chimney joke?",
    punchline: "Got stacks of em! First one's on the house",
  },
  {
    id: 154,
    setup: "Want to hear a joke about construction?",
    punchline: "Nah, I'm still working on it.",
  },
  {
    id: 155,
    setup: "Want to hear my pizza joke?",
    punchline: "Never mind, it's too cheesy.",
  },
  {
    id: 156,
    setup: "What animal is always at a game of cricket?",
    punchline: "A bat.",
  },
  {
    id: 157,
    setup: "What are the strongest days of the week?",
    punchline: "Saturday and Sunday...the rest are weekdays.",
  },
  {
    id: 158,
    setup: "What biscuit does a short person like?",
    punchline: "Shortbread. ",
  },
  {
    id: 159,
    setup: "What cheese can never be yours?",
    punchline: "Nacho cheese.",
  },
  {
    id: 160,
    setup: "What creature is smarter than a talking parrot?",
    punchline: "A spelling bee.",
  },
  {
    id: 161,
    setup: "What did celery say when he broke up with his girlfriend?",
    punchline: "She wasn't right for me, so I really don't carrot all.",
  },
  {
    id: 162,
    setup: "What did Michael Jackson name his denim store?",
    punchline: "   Billy Jeans!",
  },
  {
    id: 163,
    setup: "What did one nut say as he chased another nut?",
    punchline: " I'm a cashew!",
  },
  {
    id: 164,
    setup: "What did one plate say to the other plate?",
    punchline: "Dinner is on me!",
  },
  {
    id: 165,
    setup: "What did one snowman say to the other snow man?",
    punchline: "Do you smell carrot?",
  },
  {
    id: 166,
    setup: "What did one wall say to the other wall?",
    punchline: "I'll meet you at the corner!",
  },
  {
    id: 167,
    setup:
      "What did Romans use to cut pizza before the rolling cutter was invented?",
    punchline: "Lil Caesars",
  },
  {
    id: 168,
    setup: "What did the 0 say to the 8?",
    punchline: "Nice belt.",
  },
  {
    id: 169,
    setup: "What did the beaver say to the tree?",
    punchline: "It's been nice gnawing you.",
  },
  {
    id: 170,
    setup: "What did the big flower say to the littler flower?",
    punchline: "Hi, bud!",
  },
  {
    id: 180,
    setup:
      "What did the Buffalo say to his little boy when he dropped him off at school?",
    punchline: "Bison.",
  },
  {
    id: 181,
    setup: "What did the digital clock say to the grandfather clock?",
    punchline: "Look, no hands!",
  },
  {
    id: 182,
    setup: "What did the dog say to the two trees?",
    punchline: "Bark bark.",
  },
  {
    id: 183,
    setup: "What did the Dorito farmer say to the other Dorito farmer?",
    punchline: "Cool Ranch!",
  },
  {
    id: 184,
    setup: "What did the fish say when it swam into a wall?",
    punchline: "Damn!",
  },
  {
    id: 185,
    setup: "What did the grape do when he got stepped on?",
    punchline: "He let out a little wine.",
  },
  {
    id: 186,
    setup: "What did the judge say to the dentist?",
    punchline:
      "Do you swear to pull the tooth, the whole tooth and nothing but the tooth?",
  },
  {
    id: 187,
    setup: "What did the late tomato say to the early tomato?",
    punchline: "I’ll ketch up",
  },
  {
    id: 188,
    setup: "What did the left eye say to the right eye?",
    punchline: "Between us, something smells!",
  },
  {
    id: 189,
    setup: "What did the mountain climber name his son?",
    punchline: "Cliff.",
  },
  {
    id: 189,
    setup: "What did the ocean say to the beach?",
    punchline: "Thanks for all the sediment.",
  },
  {
    id: 190,
    setup: "What did the ocean say to the shore?",
    punchline: "Nothing, it just waved.",
  },
  {
    id: 191,
    setup: "Why don't you find hippopotamuses hiding in trees?",
    punchline: "They're really good at it.",
  },
  {
    id: 192,
    setup: "What did the pirate say on his 80th birthday?",
    punchline: "Aye Matey!",
  },
  {
    id: 193,
    setup: "What did the Red light say to the Green light?",
    punchline: "Don't look at me I'm changing!",
  },
  {
    id: 194,
    setup: "What did the scarf say to the hat?",
    punchline: "You go on ahead, I am going to hang around a bit longer.",
  },
  {
    id: 195,
    setup: "What did the shy pebble wish for?",
    punchline: "That she was a little boulder.",
  },
  {
    id: 196,
    setup: "What did the traffic light say to the car as it passed?",
    punchline: "Don't look I'm changing!",
  },
  {
    id: 197,
    setup: "What did the Zen Buddist say to the hotdog vendor?",
    punchline: "Make me one with everything.",
  },
  {
    id: 198,
    setup: "What do birds give out on Halloween?",
    punchline: "Tweets.",
  },
  {
    id: 199,
    setup: "What do I look like?",
    punchline: "A JOKE MACHINE!?",
  },
  {
    id: 200,
    setup: "What do prisoners use to call each other?",
    punchline: "Cell phones.",
  },
  {
    id: 201,
    setup: "What do vegetarian zombies eat?",
    punchline: "Grrrrrainnnnnssss.",
  },
  {
    id: 202,
    setup: "What do you call a bear with no teeth?",
    punchline: "A gummy bear!",
  },
  {
    id: 203,
    setup: "What do you call a bee that lives in America?",
    punchline: "A USB.",
  },
  {
    id: 204,
    setup: "What do you call a boomerang that won't come back?",
    punchline: "A stick.",
  },
  {
    id: 205,
    setup: "What do you call a careful wolf?",
    punchline: "Aware wolf.",
  },
  {
    id: 206,
    setup: "What do you call a cow on a trampoline?",
    punchline: "A milk shake!",
  },
  {
    id: 207,
    setup: "What do you call a cow with no legs?",
    punchline: "Ground beef.",
  },
  {
    id: 208,
    setup: "What do you call a cow with two legs?",
    punchline: "Lean beef.",
  },
  {
    id: 209,
    setup:
      "What do you call a crowd of chess players bragging about their wins in a hotel lobby?",
    punchline: "Chess nuts boasting in an open foyer.",
  },
  {
    id: 210,
    setup: "What do you call a dad that has fallen through the ice?",
    punchline: "A Popsicle.",
  },
  {
    id: 211,
    setup: "What do you call a dictionary on drugs?",
    punchline: "High definition.",
  },
  {
    id: 212,
    setup: "what do you call a dog that can do magic tricks?",
    punchline: "a labracadabrador",
  },
  {
    id: 213,
    setup: "What do you call a droid that takes the long way around?",
    punchline: "R2 detour.",
  },
  {
    id: 214,
    setup: "What do you call a duck that gets all A's?",
    punchline: "A wise quacker.",
  },
  {
    id: 215,
    setup: "What do you call a fake noodle?",
    punchline: "An impasta.",
  },
  {
    id: 216,
    setup:
      "What do you call a fashionable lawn statue with an excellent sense of rhythmn?",
    punchline: "A metro-gnome",
  },
  {
    id: 217,
    setup: "What do you call a fat psychic?",
    punchline: "A four-chin teller.",
  },
  {
    id: 218,
    setup: "What do you call a fly without wings?",
    punchline: "A walk.",
  },
  {
    id: 219,
    setup: "What do you call a girl between two posts?",
    punchline: "Annette.",
  },
  {
    id: 220,
    setup: "What do you call a group of disorganized cats?",
    punchline: "A cat-tastrophe.",
  },
  {
    id: 221,
    setup: "What do you call a group of killer whales playing instruments?",
    punchline: "An Orca-stra.",
  },
  {
    id: 222,
    setup: "What do you call a monkey in a mine field?",
    punchline: "A babooooom!",
  },
  {
    id: 223,
    setup: "What do you call a nervous javelin thrower?",
    punchline: "Shakespeare.",
  },
  {
    id: 224,
    setup: "What do you call a pig that knows karate?",
    punchline: "A pork chop!",
  },
  {
    id: 225,
    setup: "What do you call a pig with three eyes?",
    punchline: "Piiig",
  },
  {
    id: 226,
    setup: "What do you call a pile of cats?",
    punchline: " A Meowtain.",
  },
  {
    id: 227,
    setup: "What do you call a sheep with no legs?",
    punchline: "A cloud.",
  },
  {
    id: 228,
    setup: "What do you call a troublesome Canadian high schooler?",
    punchline: "A poutine.",
  },
  {
    id: 229,
    setup: "What do you call an alligator in a vest?",
    punchline: "An in-vest-igator!",
  },
  {
    id: 230,
    setup: "What do you call an Argentinian with a rubber toe?",
    punchline: "Roberto",
  },
  {
    id: 231,
    setup: "What do you call an eagle who can play the piano?",
    punchline: "Talonted!",
  },
  {
    id: 232,
    setup: "What do you call an elephant that doesn’t matter?",
    punchline: "An irrelephant.",
  },
  {
    id: 233,
    setup: "What do you call an old snowman?",
    punchline: "Water.",
  },
  {
    id: 234,
    setup: "What do you call cheese by itself?",
    punchline: "Provolone.",
  },
  {
    id: 235,
    setup: "What do you call corn that joins the army?",
    punchline: "Kernel.",
  },
  {
    id: 236,
    setup: "What do you call someone with no nose?",
    punchline: "Nobody knows.",
  },
  {
    id: 237,
    setup: "What do you call two barracuda fish?",
    punchline: " A Pairacuda!",
  },
  {
    id: 238,
    setup: "What do you do on a remote island?",
    punchline: "Try and find the TV island it belongs to.",
  },
  {
    id: 239,
    setup: "What do you do when you see a space man?",
    punchline: "Park your car, man.",
  },
  {
    id: 240,
    setup: "What do you get hanging from Apple trees?",
    punchline: "Sore arms.",
  },
  {
    id: 241,
    setup: "What do you get when you cross a bee and a sheep?",
    punchline: "A bah-humbug.",
  },
  {
    id: 242,
    setup: "What do you get when you cross a chicken with a skunk?",
    punchline: "A fowl smell!",
  },
  {
    id: 243,
    setup: "What do you get when you cross a rabbit with a water hose?",
    punchline: "Hare spray.",
  },
  {
    id: 244,
    setup: "What do you get when you cross a snowman with a vampire?",
    punchline: "Frostbite.",
  },
  {
    id: 245,
    setup: "What do you give a sick lemon?",
    punchline: "Lemonaid.",
  },
  {
    id: 246,
    setup: "What does a clock do when it's hungry?",
    punchline: "It goes back four seconds!",
  },
  {
    id: 247,
    setup: "What does a female snake use for support?",
    punchline: "A co-Bra!",
  },
  {
    id: 248,
    setup: "What does a pirate pay for his corn?",
    punchline: "A buccaneer!",
  },
  {
    id: 249,
    setup: "What does an angry pepper do?",
    punchline: "It gets jalapeño face.",
  },
  {
    id: 250,
    setup: "What happens to a frog's car when it breaks down?",
    punchline: "It gets toad.",
  },
  {
    id: 251,
    setup: "What happens when you anger a brain surgeon?",
    punchline: "They will give you a piece of your mind.",
  },
  {
    id: 252,
    setup: "What has ears but cannot hear?",
    punchline: "A field of corn.",
  },
  {
    id: 253,
    setup: "What is a centipedes's favorite Beatle song?",
    punchline: " I want to hold your hand, hand, hand, hand...",
  },
  {
    id: 254,
    setup: "What is a tornado's favorite game to play?",
    punchline: "Twister!",
  },
  {
    id: 255,
    setup: "What is a vampire's favorite fruit?",
    punchline: "A blood orange.",
  },
  {
    id: 256,
    setup: "What is a witch's favorite subject in school?",
    punchline: "Spelling!",
  },
  {
    id: 257,
    setup: "What is red and smells like blue paint?",
    punchline: "Red paint!",
  },
  {
    id: 258,
    setup: "What is the difference between ignorance and apathy?",
    punchline: "I don't know and I don't care.",
  },
  {
    id: 259,
    setup: "What is the hardest part about sky diving?",
    punchline: "The ground.",
  },
  {
    id: 260,
    setup: "What is the leading cause of dry skin?",
    punchline: "Towels",
  },
  {
    id: 261,
    setup: "What is the least spoken language in the world?",
    punchline: "Sign Language",
  },
  {
    id: 262,
    setup: "What is the tallest building in the world?",
    punchline: "The library, it’s got the most stories!",
  },
  {
    id: 263,
    setup: "What is this movie about?",
    punchline: "It is about 2 hours long.",
  },
  {
    id: 264,
    setup: "What kind of award did the dentist receive?",
    punchline: "A little plaque.",
  },
  {
    id: 265,
    setup: "What kind of bagel can fly?",
    punchline: "A plain bagel.",
  },
  {
    id: 266,
    setup: "What kind of dinosaur loves to sleep?",
    punchline: "A stega-snore-us.",
  },
  {
    id: 267,
    setup: "What kind of dog lives in a particle accelerator?",
    punchline: "A Fermilabrador Retriever.",
  },
  {
    id: 268,
    setup: "What kind of magic do cows believe in?",
    punchline: "MOODOO.",
  },
  {
    id: 269,
    setup: "What kind of music do planets listen to?",
    punchline: "Nep-tunes.",
  },
  {
    id: 270,
    setup: "What kind of pants do ghosts wear?",
    punchline: "Boo jeans.",
  },
  {
    id: 271,
    setup: "What kind of tree fits in your hand?",
    punchline: "A palm tree!",
  },
  {
    id: 272,
    setup: "What lies at the bottom of the ocean and twitches?",
    punchline: "A nervous wreck.",
  },
  {
    id: 273,
    setup: "What musical instrument is found in the bathroom?",
    punchline: "A tuba toothpaste.",
  },
  {
    id: 274,
    setup: "What time did the man go to the dentist?",
    punchline: "Tooth hurt-y.",
  },
  {
    id: 275,
    setup: "What type of music do balloons hate?",
    punchline: "Pop music!",
  },
  {
    id: 276,
    setup: "What was a more important invention than the first telephone?",
    punchline: "The second one.",
  },
  {
    id: 277,
    setup: "What was the pumpkin’s favorite sport?",
    punchline: "Squash.",
  },
  {
    id: 278,
    setup: "What's black and white and read all over?",
    punchline: "The newspaper.",
  },
  {
    id: 279,
    setup: "What's blue and not very heavy?",
    punchline: " Light blue.",
  },
  {
    id: 280,
    setup: "What's brown and sticky?",
    punchline: "A stick.",
  },
  {
    id: 281,
    setup: "What's orange and sounds like a parrot?",
    punchline: "A Carrot.",
  },
  {
    id: 282,
    setup: "What's red and bad for your teeth?",
    punchline: "A Brick.",
  },
  {
    id: 283,
    setup: "What's the best thing about elevator jokes?",
    punchline: "They work on so many levels.",
  },
  {
    id: 284,
    setup: "What's the difference between a guitar and a fish?",
    punchline: 'You can tune a guitar but you can\'t "tuna"fish!',
  },
  {
    id: 285,
    setup: "What's the difference between a hippo and a zippo?",
    punchline: "One is really heavy, the other is a little lighter.",
  },
  {
    id: 286,
    setup: "What's the difference between a seal and a sea lion?",
    punchline: "An ion! ",
  },
  {
    id: 287,
    setup: "What's the worst part about being a cross-eyed teacher?",
    punchline: "They can't control their pupils.",
  },
  {
    id: 288,
    setup: "What's the worst thing about ancient history class?",
    punchline: "The teachers tend to Babylon.",
  },
  {
    id: 289,
    setup: "What’s brown and sounds like a bell?",
    punchline: "Dung!",
  },
  {
    id: 290,
    setup: "What’s E.T. short for?",
    punchline: "He’s only got little legs.",
  },
  {
    id: 291,
    setup: "What’s Forest Gump’s Facebook password?",
    punchline: "1forest1",
  },
  {
    id: 292,
    setup: "What’s the advantage of living in Switzerland?",
    punchline: "Well, the flag is a big plus.",
  },
  {
    id: 293,
    setup:
      "What’s the difference between an African elephant and an Indian elephant?",
    punchline: "About 5000 miles.",
  },
  {
    id: 294,
    setup: "When do doctors get angry?",
    punchline: "When they run out of patients.",
  },
  {
    id: 295,
    setup: "When does a joke become a dad joke?",
    punchline: "When it becomes apparent.",
  },
  {
    id: 296,
    setup: "When is a door not a door?",
    punchline: "When it's ajar.",
  },
  {
    id: 297,
    setup: "Where did you learn to make ice cream?",
    punchline: "Sunday school.",
  },
  {
    id: 298,
    setup: "Where do bees go to the bathroom?",
    punchline: " The BP station.",
  },
  {
    id: 299,
    setup: "Where do hamburgers go to dance?",
    punchline: "The meat-ball.",
  },
  {
    id: 300,
    setup: "Where do rabbits go after they get married?",
    punchline: "On a bunny-moon.",
  },
  {
    id: 301,
    setup: "Where do sheep go to get their hair cut?",
    punchline: "The baa-baa shop.",
  },
  {
    id: 302,
    setup: "Where do you learn to make banana splits?",
    punchline: "At sundae school.",
  },
  {
    id: 303,
    setup: "Where do young cows eat lunch?",
    punchline: "In the calf-ateria.",
  },
  {
    id: 304,
    setup: "Where does batman go to the bathroom?",
    punchline: "The batroom.",
  },
  {
    id: 305,
    setup: "Where does Fonzie like to go for lunch?",
    punchline: "Chick-Fil-Eyyyyyyyy.",
  },
  {
    id: 306,
    setup: "Where does Napoleon keep his armies?",
    punchline: "In his sleevies.",
  },
  {
    id: 307,
    setup: "Where was the Declaration of Independence signed?",
    punchline: "At the bottom! ",
  },
  {
    id: 308,
    setup: "Where’s the bin?",
    punchline: "I haven’t been anywhere!",
  },
  {
    id: 309,
    setup: "Which side of the chicken has more feathers?",
    punchline: "The outside.",
  },
  {
    id: 310,
    setup: "Who did the wizard marry?",
    punchline: "His ghoul-friend",
  },
  {
    id: 311,
    setup: "Who is the coolest Doctor in the hospital?",
    punchline: "The hip Doctor!",
  },
  {
    id: 312,
    setup: "Why are fish easy to weigh?",
    punchline: "Because they have their own scales.",
  },
  {
    id: 313,
    setup: "Why are fish so smart?",
    punchline: "Because they live in schools!",
  },
  {
    id: 314,
    setup: "Why are ghosts bad liars?",
    punchline: "Because you can see right through them!",
  },
  {
    id: 315,
    setup: "Why are graveyards so noisy?",
    punchline: "Because of all the coffin.",
  },
  {
    id: 316,
    setup: "Why are mummys scared of vacation?",
    punchline: "They're afraid to unwind.",
  },
  {
    id: 317,
    setup: "Why are oranges the smartest fruit?",
    punchline: "Because they are made to concentrate. ",
  },
  {
    id: 318,
    setup: "Why are pirates called pirates?",
    punchline: "Because they arrr!",
  },
  {
    id: 319,
    setup: "Why are skeletons so calm?",
    punchline: "Because nothing gets under their skin.",
  },
  {
    id: 320,
    setup: "Why can't a bicycle stand on its own?",
    punchline: "It's two-tired.",
  },
  {
    id: 321,
    setup: 'Why can\'t you use "Beef stew"as a password?',
    punchline: "Because it's not stroganoff.",
  },
  {
    id: 322,
    setup: "Why can't your nose be 12 inches long?",
    punchline: "Because then it'd be a foot!",
  },
  {
    id: 323,
    setup: "Why can’t you hear a pterodactyl go to the bathroom?",
    punchline: "The p is silent.",
  },
  {
    id: 324,
    setup: "Why couldn't the kid see the pirate movie?",
    punchline: "Because it was rated arrr!",
  },
  {
    id: 325,
    setup: "Why couldn't the lifeguard save the hippie?",
    punchline: "He was too far out, man.",
  },
  {
    id: 326,
    setup: "Why did Dracula lie in the wrong coffin?",
    punchline: "He made a grave mistake.",
  },
  {
    id: 327,
    setup:
      "Why did Sweden start painting barcodes on the sides of their battleships?",
    punchline: "So they could Scandinavian.",
  },
  {
    id: 328,
    setup: "Why did the A go to the bathroom and come out as an E?",
    punchline: "Because he had a vowel movement.",
  },
  {
    id: 329,
    setup: "Why did the barber win the race?",
    punchline: "He took a short cut.",
  },
  {
    id: 330,
    setup: "Why did the belt go to prison?",
    punchline: "He held up a pair of pants!",
  },
  {
    id: 331,
    setup: "Why did the burglar hang his mugshot on the wall?",
    punchline: "To prove that he was framed!",
  },
  {
    id: 332,
    setup: "Why did the chicken get a penalty?",
    punchline: "For fowl play.",
  },
  {
    id: 333,
    setup: "Why did the Clydesdale give the pony a glass of water?",
    punchline: "Because he was a little horse!",
  },
  {
    id: 334,
    setup: "Why did the coffee file a police report?",
    punchline: "It got mugged.",
  },
  {
    id: 335,
    setup: "Why did the cookie cry?",
    punchline: "Because his mother was a wafer so long",
  },
  {
    id: 336,
    setup: "Why did the cookie cry?",
    punchline: "It was feeling crumby.",
  },
  {
    id: 337,
    setup: "Why did the cowboy have a weiner dog?",
    punchline: "Somebody told him to get a long little doggy.",
  },
  {
    id: 338,
    setup: "Why did the fireman wear red, white, and blue suspenders?",
    punchline: "To hold his pants up.",
  },
  {
    id: 339,
    setup: "Why did the girl smear peanut butter on the road?",
    punchline: "To go with the traffic jam.",
  },
  {
    id: 340,
    setup: "Why did the half blind man fall in the well?",
    punchline: "Because he couldn't see that well!",
  },
  {
    id: 341,
    setup: "Why did the house go to the doctor?",
    punchline: "It was having window panes.",
  },
  {
    id: 342,
    setup: "Why did the kid cross the playground?",
    punchline: "To get to the other slide.",
  },
  {
    id: 343,
    setup: "Why did the man put his money in the freezer?",
    punchline: "He wanted cold hard cash!",
  },
  {
    id: 344,
    setup: "Why did the man run around his bed?",
    punchline: "Because he was trying to catch up on his sleep!",
  },
  {
    id: 345,
    setup: "Why did the melons plan a big wedding?",
    punchline: "Because they cantaloupe!",
  },
  {
    id: 346,
    setup: "Why did the octopus beat the shark in a fight?",
    punchline: "Because it was well armed.",
  },
  {
    id: 347,
    setup: "Why did the opera singer go sailing?",
    punchline: "They wanted to hit the high Cs.",
  },
  {
    id: 348,
    setup: "Why did the scarecrow win an award?",
    punchline: "Because he was outstanding in his field.",
  },
  {
    id: 349,
    setup: "Why did the tomato blush?",
    punchline: "Because it saw the salad dressing.",
  },
  {
    id: 350,
    setup: "Why did the tree go to the dentist?",
    punchline: "It needed a root canal.",
  },
  {
    id: 351,
    setup: "Why did the worker get fired from the orange juice factory?",
    punchline: "Lack of concentration.",
  },
  {
    id: 352,
    setup: "Why didn't the number 4 get into the nightclub?",
    punchline: "Because he is 2 square.",
  },
  {
    id: 353,
    setup: "Why didn’t the orange win the race?",
    punchline: "It ran out of juice.",
  },
  {
    id: 354,
    setup: "Why didn’t the skeleton cross the road?",
    punchline: "Because he had no guts.",
  },
  {
    id: 355,
    setup:
      "Why do bananas have to put on sunscreen before they go to the beach?",
    punchline: "Because they might peel!",
  },
  {
    id: 356,
    setup: "Why do bears have hairy coats?",
    punchline: "Fur protection.",
  },
  {
    id: 357,
    setup: "Why do bees have sticky hair?",
    punchline: "Because they use honey combs!",
  },
  {
    id: 358,
    setup: "Why do bees hum?",
    punchline: "Because they don't know the words.",
  },
  {
    id: 359,
    setup: "Why do birds fly south for the winter?",
    punchline: "Because it's too far to walk.",
  },
  {
    id: 360,
    setup: "Why do choirs keep buckets handy?",
    punchline: "So they can carry their tune",
  },
  {
    id: 361,
    setup: "Why do crabs never give to charity?",
    punchline: "Because they’re shellfish.",
  },
  {
    id: 362,
    setup: "Why do ducks make great detectives?",
    punchline: "They always quack the case.",
  },
  {
    id: 363,
    setup: "Why do mathematicians hate the U.S.?",
    punchline: "Because it's indivisible.",
  },
  {
    id: 364,
    setup: "Why do pirates not know the alphabet?",
    punchline: 'They always get stuck at "C".',
  },
  {
    id: 365,
    setup: "Why do pumpkins sit on people’s porches?",
    punchline: "They have no hands to knock on the door.",
  },
  {
    id: 366,
    setup: "Why do scuba divers fall backwards into the water?",
    punchline: "Because if they fell forwards they’d still be in the boat.",
  },
  {
    id: 367,
    setup: "Why do trees seem suspicious on sunny days?",
    punchline: "Dunno, they're just a bit shady.",
  },
  {
    id: 368,
    setup: "Why do valley girls hang out in odd numbered groups?",
    punchline: "Because they can't even.",
  },
  {
    id: 369,
    setup: "Why do wizards clean their teeth three times a day?",
    punchline: "To prevent bat breath!",
  },
  {
    id: 370,
    setup: "Why do you never see elephants hiding in trees?",
    punchline: "Because they're so good at it.",
  },
  {
    id: 371,
    setup: "Why does a chicken coop only have two doors?",
    punchline: "Because if it had four doors it would be a chicken sedan.",
  },
  {
    id: 372,
    setup: "Why does a Moon-rock taste better than an Earth-rock?",
    punchline: "Because it's a little meteor.",
  },
  {
    id: 373,
    setup:
      "Why does it take longer to get from 1st to 2nd base, than it does to get from 2nd to 3rd base?",
    punchline: "Because there’s a Shortstop in between!",
  },
  {
    id: 374,
    setup: "Why does Norway have barcodes on their battleships?",
    punchline: "So when they get back to port, they can Scandinavian.",
  },
  {
    id: 375,
    setup: "Why does Superman get invited to dinners?",
    punchline: "Because he is a Supperhero.",
  },
  {
    id: 376,
    setup: "Why does Waldo only wear stripes?",
    punchline: "Because he doesn't want to be spotted.",
  },
  {
    id: 377,
    setup: "Knock-knock.",
    punchline: "A race condition. Who is there?",
  },
  {
    id: 378,
    setup: "What's the best part about TCP jokes?",
    punchline: "I get to keep telling them until you get them.",
  },
  {
    id: 379,
    setup:
      "A programmer puts two glasses on his bedside table before going to sleep.",
    punchline:
      "A full one, in case he gets thirsty, and an empty one, in case he doesn’t.",
  },
  {
    id: 380,
    setup: "There are 10 kinds of people in this world.",
    punchline:
      "Those who understand binary, those who don't, and those who weren't expecting a base 3 joke.",
  },
  {
    id: 381,
    setup: "Two guys walk into a bar . . .",
    punchline:
      'The first guy says "Ouch!" and the second says "Yeah, I didn\'t see it either."',
  },
  {
    id: 382,
    setup: "What did the router say to the doctor?",
    punchline: "It hurts when IP.",
  },
  {
    id: 383,
    setup: "An IPv6 packet is walking out of the house.",
    punchline: "He goes nowhere.",
  },
  {
    id: 384,
    setup: "A DHCP packet walks into a bar and asks for a beer.",
    punchline: 'Bartender says, "here, but I’ll need that back in an hour!"',
  },
  {
    id: 385,
    setup: "3 SQL statements walk into a NoSQL bar. Soon, they walk out",
    punchline: "They couldn't find a table.",
  },
  {
    id: 386,
    setup:
      "I saw a nice stereo on Craigslist for $1. Seller says the volume is stuck on ‘high’",
    punchline: "I couldn’t turn it down.",
  },
  {
    id: 387,
    setup:
      "My older brother always tore the last pages of my comic books, and never told me why.",
    punchline: "I had to draw my own conclusions.",
  },
];

module.exports = {
  name: "joke",
  aliases: ["gibfunny", "tellajoke"],
  description: "Makes you laugh.",
  //   argumentDescription: "",
  // roles: ["Admin", "Mod", "Student"],
  args: false,
  //   usage: "",
  guildOnly: false,
  cooldown: 5,
  category: "Fun",
  execute(message, args) {
    //find a joke, send the setup and wait 3 seconds before sending the punchline
    let random = Math.floor(Math.random() * jokes.length);
    const jokeEmbed = new Discord.MessageEmbed()
      .setColor("#5247ff")
      .setDescription(jokes[random].setup);
    message.reply(jokeEmbed);

    setTimeout(function () {
      const jokeEmbed = new Discord.MessageEmbed()
        .setColor("#ed0000")
        .setDescription(jokes[random].punchline);
      return message.reply(jokeEmbed);
    }, 3000);
  },
};
