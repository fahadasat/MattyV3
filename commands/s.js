const Discord = require("discord.js");
var yahooFinance = require("yahoo-finance");
const dbFunction = require("../db/dbFunction");
const dbObjects = require("../db/dbObjects");

module.exports = {
  name: "s",
  aliases: ["stock", "stocks"],
  description: "Buy stock, sell stock, check the price of your stock.",
  argumentDescription: "Sub commands for stock features.",
  roles: ["Admin", "Mod", "Student"],
  args: false,
  usage: "[s]",
  guildOnly: true,
  cooldown: 2,
  category: "Fun",
  async execute(message, args) {
    // console.log(dbObjects.stocks);
    if (!args.length) {
      //print all the commands if there isn't any arguments
      const stockEmbed = new Discord.MessageEmbed()
        .setTitle("Stock Arguments:")
        .setColor("#ff4242")
        .addFields(
          {
            name: "buy [portfolio number] [ticker] [amount (USD)]",
            value:
              "Buy a stock with the amount of dollars you want to use for the purchase.",
          },
          {
            name: "sell [portfolio number] [ticker] [amount of stock]",
            value: "Sell an amount of stock.",
          },
          {
            name: "price [ticker] [ticker]",
            value: "Use to check the price of a single or multiple ticker.",
          },
          {
            name: "watchlist",
            value: "Displays all subcommands for watchlist.",
          },
          {
            name: "portfolio",
            value: "Displays all subcommands for portfolio.",
          }
        );
      return message.reply(stockEmbed);
    }
    let arrIndex = -1;
    for (let i = 0; i < dbObjects.stocks.length; i++) {
      if (dbObjects.stocks[i]._id === message.author.id) arrIndex = i;
    }
    switch (args[0]) {
      case "buy":
        if (args.length < 4)
          return message.reply("Use [~s] to see the correct arguments.");
        if (isNaN(args[1]))
          return message.reply("Use [~s] to see the correct arguments.");
        if (isNaN(args[3]))
          return message.reply("Use [~s] to see the correct arguments.");
        if (arrIndex < 0 || dbObjects.stocks[arrIndex].portfolio.length === 0)
          return message.reply("Create a portfolio first.");
        if (
          parseFloat(args[1]) - 1 >
            dbObjects.stocks[arrIndex].portfolio.length - 1 ||
          parseFloat(args[1]) - 1 < 0
        )
          return message.reply("Incorrect portfolio number.");
        if (parseFloat(args[3]) < 0)
          return message.reply("Incorrect money amount.");
        if (parseFloat(args[3]) > dbObjects.stocks[arrIndex].cash)
          return message.reply(
            `You need $${(
              parseFloat(args[3]) - dbObjects.stocks[arrIndex].cash
            ).toLocaleString()} more to cover this order.`
          );

        try {
          this.getQuote(args[2]).then((quotes) => {
            let stockIndex = -1;
            try {
              for (
                let i = 0;
                i <
                dbObjects.stocks[arrIndex].portfolio[parseFloat(args[1]) - 1]
                  .stocks.length;
                i++
              ) {
                if (
                  dbObjects.stocks[arrIndex].portfolio[parseFloat(args[1]) - 1]
                    .stocks[i].name === quotes.price.symbol
                )
                  stockIndex = i;
              }
            } catch (error) {
              return message.reply(`Couldn't find ${args[2].toUpperCase()}.`);
            }
            if (stockIndex > -1) {
              dbFunction.updateStock(
                arrIndex,
                stockIndex,
                message.author.id,
                quotes.price.symbol,

                parseFloat(args[3]) / quotes.price.regularMarketPrice,
                parseFloat(args[3]),
                dbObjects.stocks[arrIndex].portfolio[parseFloat(args[1]) - 1]
                  .portfolioName,
                parseFloat(args[1]) - 1,
                parseFloat(args[3])
              );
            } else
              dbFunction.addStock(
                arrIndex,
                message.author.id,
                quotes.price.symbol,
                parseFloat(args[3]) / quotes.price.regularMarketPrice,
                parseFloat(args[3]),
                dbObjects.stocks[arrIndex].portfolio[parseFloat(args[1]) - 1]
                  .portfolioName,
                parseFloat(args[1]) - 1,
                parseFloat(args[3])
              );
            return message.reply(
              `You spent ${parseFloat(args[3])} on ${
                parseFloat(args[3]) / quotes.price.regularMarketPrice
              } share(s) of ${quotes.price.symbol}.`
            );
          });
        } catch (error) {
          console.log(error);
          return message.reply(
            "Use ~buy [portfolio number] [ticker] [amount in usd]"
          );
        }

        break;
      case "sell":
        if (args.length < 4)
          return message.reply("Use [~s] to see the correct arguments.");
        if (isNaN(args[1]))
          return message.reply("Use [~s] to see the correct arguments.");
        if (isNaN(args[3]))
          return message.reply("Use [~s] to see the correct arguments.");
        if (parseFloat(args[3]) < 1)
          return message.reply("Use [~s] to see the correct arguments.");
        if (arrIndex < 0 || dbObjects.stocks[arrIndex].portfolio.length === 0)
          return message.reply("Create a portfolio first.");

        if (
          parseFloat(args[1]) - 1 >
            dbObjects.stocks[arrIndex].portfolio.length - 1 ||
          parseFloat(args[1]) - 1 < 0
        )
          return message.reply("Incorrect portfolio number.");
        let stockIndex = -1;
        for (
          let i = 0;
          i <
          dbObjects.stocks[arrIndex].portfolio[parseFloat(args[1]) - 1].stocks
            .length;
          i++
        ) {
          if (
            dbObjects.stocks[arrIndex].portfolio[parseFloat(args[1]) - 1]
              .stocks[i].name === args[2].toUpperCase()
          )
            stockIndex = i;
        }
        if (stockIndex < 0)
          return message.reply(
            `Couldn't find ${args[2].toUpperCase()} in ${
              dbObjects.stocks[arrIndex].portfolio[parseFloat(args[1]) - 1]
                .portfolioName
            }.`
          );
        if (
          dbObjects.stocks[arrIndex].portfolio[parseFloat(args[1]) - 1].stocks[
            stockIndex
          ].amount < parseFloat(args[3])
        )
          return message.reply(
            `You need ${
              parseFloat(args[3]) -
              dbObjects.stocks[arrIndex].portfolio[parseFloat(args[1]) - 1]
                .stocks[stockIndex].amount
            } more ${args[2].toUpperCase()} to cover this offer.`
          );
        try {
          this.getQuote(args[2]).then((quotes) => {
            if (
              parseFloat(args[3]) ===
              dbObjects.stocks[arrIndex].portfolio[parseFloat(args[1]) - 1]
                .stocks[stockIndex].amount
            ) {
              dbFunction.deleteStock(
                message.author.id,
                dbObjects.stocks[arrIndex].portfolio[parseFloat(args[1]) - 1]
                  .portfolioName,
                quotes.price.symbol,
                arrIndex,
                parseFloat(args[1]) - 1,
                stockIndex,
                parseFloat(args[3]) * quotes.price.regularMarketPrice
              );
            } else {
              // dbObjects.stocks[arrIndex].portfolio[parseFloat(args[1]) - 1]
              //     .stocks[stockIndex].price -
              let price =
                (dbObjects.stocks[arrIndex].portfolio[parseFloat(args[1]) - 1]
                  .stocks[stockIndex].price /
                  dbObjects.stocks[arrIndex].portfolio[parseFloat(args[1]) - 1]
                    .stocks[stockIndex].amount) *
                parseFloat(args[3]);
              dbFunction.updateStock(
                arrIndex,
                stockIndex,
                message.author.id,
                quotes.price.symbol,
                -parseFloat(args[3]),
                -price,
                dbObjects.stocks[arrIndex].portfolio[parseFloat(args[1]) - 1]
                  .portfolioName,
                parseFloat(args[1]) - 1,
                -(parseFloat(args[3]) * quotes.price.regularMarketPrice)
              );
            }
            return message.reply(
              `You sold your ${parseFloat(args[3])} shares of ${
                quotes.price.symbol
              } for ${parseFloat(args[3]) * quotes.price.regularMarketPrice}.`
            );
          });
        } catch (error) {
          return message.reply(`Couldn't find ${args[2].toUpperCase()}.`);
        }
        break;
      case "price":
        if (args.length < 2)
          return message.reply("Use [~s] to see the correct arguments.");
        for (let i = 1; i < args.length; i++) {
          try {
            this.getQuote(args[i]).then((quotes) => {
              try {
                // console.log(quotes);
                let title = `${quotes.price.symbol} - `;
                if (quotes.price.longName !== null)
                  title += quotes.price.longName;
                const stock = new Discord.MessageEmbed()
                  .setTitle(title)
                  .setColor("#ff4242")
                  .setURL(`https://finance.yahoo.com/quote/${args[i]}`)
                  .addFields(
                    {
                      name: `Regular Market Price (${quotes.price.currency})`,
                      value: `${quotes.price.currencySymbol} ${quotes.price.regularMarketPrice}`,
                      inline: true,
                    },
                    {
                      name: "Day Low",
                      value: `${quotes.price.currencySymbol} ${quotes.price.regularMarketDayLow}`,
                      inline: true,
                    },
                    {
                      name: "Day High",
                      value: `${quotes.price.currencySymbol} ${quotes.price.regularMarketDayHigh}`,
                      inline: true,
                    },
                    {
                      name: "Regular Market Change",
                      value: `${quotes.price.currencySymbol} ${quotes.price.regularMarketChange}`,
                      inline: true,
                    },
                    {
                      name: "Regular Market Change Percentage",
                      value: `${
                        quotes.price.regularMarketChangePercent * 100
                      }%`,
                      inline: true,
                    },
                    {
                      name: "Regular Market Open",
                      value: `${quotes.price.currencySymbol} ${quotes.price.regularMarketOpen}`,
                      inline: true,
                    },
                    {
                      name: "Regular Market Previous Close",
                      value: `${quotes.price.currencySymbol} ${quotes.price.regularMarketPreviousClose}`,
                      inline: true,
                    }
                    // {
                    //   name: "Regular Market Volume",
                    //   value: `${quotes.summaryDetail.regularMarketVolume}`,
                    //   inline: true,
                    // },
                    // {
                    //   name: "Average Volume",
                    //   value: `${quotes.summaryDetail.averageVolume}`,
                    //   inline: true,
                    // },
                    // {
                    //   name: "Average 10 Days Volume",
                    //   value: `${quotes.summaryDetail.averageVolume10days}`,
                    //   inline: true,
                    // }
                  )
                  .setTimestamp()
                  .setFooter(quotes.price.quoteSourceName);
                if (quotes.summaryDetail.dividendYield == null)
                  stock.addField("Dividend Yield", `N/A`, true);
                else
                  stock.addField(
                    "Dividend Yield",
                    `${quotes.summaryDetail.dividendYield}`,
                    true
                  );
                if (quotes.summaryDetail.dividendYield == null)
                  stock.addField("Dividend Rate", `N/A`, true);
                else
                  stock.addField(
                    "Dividend Rate",
                    `${quotes.summaryDetail.dividendRate}`,
                    true
                  );
                if (quotes.summaryDetail.dividendYield == null)
                  stock.addField("Ex-Divident Date", `N/A`, true);
                else
                  stock.addField(
                    "Ex-Divident Date",
                    `${quotes.summaryDetail.exDividendDate}`,
                    true
                  );
                return message.reply(stock);
              } catch (error) {
                console.log(error);
                message.reply(`Couldn't find ${args[i]}.`);
              }
            });
          } catch (error) {
            console.log(error);
            message.reply(`Couldn't find ${args[i]}.`);
          }
        }

        break;
      case "watchlist":
        if (args.length < 2) {
          //print all the commands if the arguments arent correct
          const watchlistEmbed = new Discord.MessageEmbed()
            .setTitle("Watchlist Arguments:")
            .setColor("#ff4242")
            .addFields(
              {
                name: "add [ticker]",
                value: "Add a stock to the watchlist.",
              },
              {
                name: "remove [ticker]",
                value: "Remove a stock from the watchlist.",
              },
              {
                name: "view",
                value: "Prints the details of your watchlist.",
              }
            );
          return message.reply(watchlistEmbed);
        }
        if (arrIndex < 0) {
          dbFunction.createStockUser(message.author.id).then(() => {
            arrIndex = dbObjects.stocks.length - 1;
            switch (args[1]) {
              case "add":
                if (args.length < 3) return message.reply("Nothing to add");
                for (
                  let i = 0;
                  i < dbObjects.stocks[arrIndex].watchlist.length;
                  i++
                ) {
                  if (
                    args[2].toUpperCase() ===
                    dbObjects.stocks[arrIndex].watchlist[i]
                  )
                    return message.reply(
                      `${args[2].toUpperCase()} is already in the watchlist.`
                    );
                }
                dbFunction.addWatchlist(
                  message.author.id,
                  args[2].toUpperCase(),
                  arrIndex
                );
                message.reply(
                  `${args[2].toUpperCase()} was added to the watchlist.`
                );
                break;
              case "remove":
                if (args.length < 3) return message.reply("Nothing to remove");
                for (
                  let i = 0;
                  i < dbObjects.stocks[arrIndex].watchlist.length;
                  i++
                ) {
                  if (
                    args[2].toUpperCase() ===
                    dbObjects.stocks[arrIndex].watchlist[i]
                  ) {
                    dbFunction.removeWatchlist(
                      message.author.id,
                      args[2].toUpperCase(),
                      arrIndex,
                      i
                    );
                    return message.reply(
                      `${args[2].toUpperCase()} was removed from the watchlist.`
                    );
                  }
                }
                message.reply(
                  `${args[2].toUpperCase()} is not in the watchlist.`
                );
                break;
              case "view":
                if (dbObjects.stocks[arrIndex].watchlist.length < 1)
                  return message.reply("Add a stock to your watchlist first.");
                for (
                  let i = 0;
                  i < dbObjects.stocks[arrIndex].watchlist.length;
                  i++
                ) {
                  try {
                    this.getQuote(dbObjects.stocks[arrIndex].watchlist[i]).then(
                      (quotes) => {
                        try {
                          // console.log(quotes);
                          let title = `${quotes.price.symbol} - `;
                          if (quotes.price.longName !== null)
                            title += quotes.price.longName;
                          const stock = new Discord.MessageEmbed()
                            .setTitle(title)
                            .setColor("#ff4242")
                            .setURL(
                              `https://finance.yahoo.com/quote/${dbObjects.stocks[arrIndex].watchlist[i]}`
                            )
                            .addFields(
                              {
                                name: `Regular Market Price (${quotes.price.currency})`,
                                value: `${quotes.price.currencySymbol} ${quotes.price.regularMarketPrice}`,
                                inline: true,
                              },
                              {
                                name: "Day Low",
                                value: `${quotes.price.currencySymbol} ${quotes.price.regularMarketDayLow}`,
                                inline: true,
                              },
                              {
                                name: "Day High",
                                value: `${quotes.price.currencySymbol} ${quotes.price.regularMarketDayHigh}`,
                                inline: true,
                              },
                              {
                                name: "Regular Market Change",
                                value: `${quotes.price.currencySymbol} ${quotes.price.regularMarketChange}`,
                                inline: true,
                              },
                              {
                                name: "Regular Market Change Percentage",
                                value: `${quotes.price.regularMarketChangePercent}%`,
                                inline: true,
                              },
                              {
                                name: "Regular Market Open",
                                value: `${quotes.price.currencySymbol} ${quotes.price.regularMarketOpen}`,
                                inline: true,
                              },
                              {
                                name: "Regular Market Previous Close",
                                value: `${quotes.price.currencySymbol} ${quotes.price.regularMarketPreviousClose}`,
                                inline: true,
                              }
                              // {
                              //   name: "Regular Market Volume",
                              //   value: `${quotes.summaryDetail.regularMarketVolume}`,
                              //   inline: true,
                              // },
                              // {
                              //   name: "Average Volume",
                              //   value: `${quotes.summaryDetail.averageVolume}`,
                              //   inline: true,
                              // },
                              // {
                              //   name: "Average 10 Days Volume",
                              //   value: `${quotes.summaryDetail.averageVolume10days}`,
                              //   inline: true,
                              // }
                            )
                            .setTimestamp()
                            .setFooter(quotes.price.quoteSourceName);
                          if (quotes.summaryDetail.dividendYield == null)
                            stock.addField("Dividend Yield", `N/A`, true);
                          else
                            stock.addField(
                              "Dividend Yield",
                              `${quotes.summaryDetail.dividendYield}`,
                              true
                            );
                          if (quotes.summaryDetail.dividendYield == null)
                            stock.addField("Dividend Rate", `N/A`, true);
                          else
                            stock.addField(
                              "Dividend Rate",
                              `${quotes.summaryDetail.dividendRate}`,
                              true
                            );
                          if (quotes.summaryDetail.dividendYield == null)
                            stock.addField("Ex-Divident Date", `N/A`, true);
                          else
                            stock.addField(
                              "Ex-Divident Date",
                              `${quotes.summaryDetail.exDividendDate}`,
                              true
                            );
                          return message.reply(stock);
                        } catch (error) {
                          console.log(error);
                          message.reply(
                            `Couldn't find ${dbObjects.stocks[arrIndex].watchlist[i]}.`
                          );
                        }
                      }
                    );
                  } catch (error) {
                    console.log(error);
                    message.reply(
                      `Couldn't find ${dbObjects.stocks[arrIndex].watchlist[i]}.`
                    );
                  }
                }
                break;
            }
          });
        } else {
          switch (args[1]) {
            case "add":
              if (args.length < 3) return message.reply("Nothing to add");
              for (
                let i = 0;
                i < dbObjects.stocks[arrIndex].watchlist.length;
                i++
              ) {
                if (
                  args[2].toUpperCase() ===
                  dbObjects.stocks[arrIndex].watchlist[i]
                )
                  return message.reply(
                    `${args[2].toUpperCase()} is already in the watchlist.`
                  );
              }
              dbFunction.addWatchlist(
                message.author.id,
                args[2].toUpperCase(),
                arrIndex
              );
              message.reply(
                `${args[2].toUpperCase()} was added to the watchlist.`
              );
              break;
            case "remove":
              if (args.length < 3) return message.reply("Nothing to remove");
              for (
                let i = 0;
                i < dbObjects.stocks[arrIndex].watchlist.length;
                i++
              ) {
                if (
                  args[2].toUpperCase() ===
                  dbObjects.stocks[arrIndex].watchlist[i]
                ) {
                  dbFunction.removeWatchlist(
                    message.author.id,
                    args[2].toUpperCase(),
                    arrIndex,
                    i
                  );
                  return message.reply(
                    `${args[2].toUpperCase()} was removed from the watchlist.`
                  );
                }
              }
              message.reply(
                `${args[2].toUpperCase()} is not in the watchlist.`
              );
              break;
            case "view":
              if (dbObjects.stocks[arrIndex].watchlist.length < 1)
                return message.reply("Add a stock to your watchlist first.");
              for (
                let i = 0;
                i < dbObjects.stocks[arrIndex].watchlist.length;
                i++
              ) {
                try {
                  this.getQuote(dbObjects.stocks[arrIndex].watchlist[i]).then(
                    (quotes) => {
                      try {
                        // console.log(quotes);
                        let title = `${quotes.price.symbol} - `;
                        if (quotes.price.longName !== null)
                          title += quotes.price.longName;
                        const stock = new Discord.MessageEmbed()
                          .setTitle(title)
                          .setColor("#ff4242")
                          .setURL(
                            `https://finance.yahoo.com/quote/${dbObjects.stocks[arrIndex].watchlist[i]}`
                          )
                          .addFields(
                            {
                              name: `Regular Market Price (${quotes.price.currency})`,
                              value: `${quotes.price.currencySymbol} ${quotes.price.regularMarketPrice}`,
                              inline: true,
                            },
                            {
                              name: "Day Low",
                              value: `${quotes.price.currencySymbol} ${quotes.price.regularMarketDayLow}`,
                              inline: true,
                            },
                            {
                              name: "Day High",
                              value: `${quotes.price.currencySymbol} ${quotes.price.regularMarketDayHigh}`,
                              inline: true,
                            },
                            {
                              name: "Regular Market Change",
                              value: `${quotes.price.currencySymbol} ${quotes.price.regularMarketChange}`,
                              inline: true,
                            },
                            {
                              name: "Regular Market Change Percentage",
                              value: `${quotes.price.regularMarketChangePercent}%`,
                              inline: true,
                            },
                            {
                              name: "Regular Market Open",
                              value: `${quotes.price.currencySymbol} ${quotes.price.regularMarketOpen}`,
                              inline: true,
                            },
                            {
                              name: "Regular Market Previous Close",
                              value: `${quotes.price.currencySymbol} ${quotes.price.regularMarketPreviousClose}`,
                              inline: true,
                            }
                            // {
                            //   name: "Regular Market Volume",
                            //   value: `${quotes.summaryDetail.regularMarketVolume}`,
                            //   inline: true,
                            // },
                            // {
                            //   name: "Average Volume",
                            //   value: `${quotes.summaryDetail.averageVolume}`,
                            //   inline: true,
                            // },
                            // {
                            //   name: "Average 10 Days Volume",
                            //   value: `${quotes.summaryDetail.averageVolume10days}`,
                            //   inline: true,
                            // }
                          )
                          .setTimestamp()
                          .setFooter(quotes.price.quoteSourceName);

                        if (quotes.summaryDetail !== undefined) {
                          stock.addFields(
                            {
                              name: "Regular Market Volume",
                              value: `${quotes.summaryDetail.regularMarketVolume}`,
                              inline: true,
                            },
                            {
                              name: "Average Volume",
                              value: `${quotes.summaryDetail.averageVolume}`,
                              inline: true,
                            },
                            {
                              name: "Average 10 Days Volume",
                              value: `${quotes.summaryDetail.averageVolume10days}`,
                              inline: true,
                            }
                          );
                          if (quotes.summaryDetail.dividendYield == null)
                            stock.addField("Dividend Yield", `N/A`, true);
                          else
                            stock.addField(
                              "Dividend Yield",
                              `${quotes.summaryDetail.dividendYield}`,
                              true
                            );
                          if (quotes.summaryDetail.dividendYield == null)
                            stock.addField("Dividend Rate", `N/A`, true);
                          else
                            stock.addField(
                              "Dividend Rate",
                              `${quotes.summaryDetail.dividendRate}`,
                              true
                            );
                          if (quotes.summaryDetail.dividendYield == null)
                            stock.addField("Ex-Divident Date", `N/A`, true);
                          else
                            stock.addField(
                              "Ex-Divident Date",
                              `${quotes.summaryDetail.exDividendDate}`,
                              true
                            );
                        }

                        return message.reply(stock);
                      } catch (error) {
                        console.log(error);
                        message.reply(
                          `Couldn't find ${dbObjects.stocks[arrIndex].watchlist[i]}.`
                        );
                      }
                    }
                  );
                } catch (error) {
                  console.log(error);
                  message.reply(
                    `Couldn't find ${dbObjects.stocks[arrIndex].watchlist[i]}.`
                  );
                }
              }
              break;
          }
        }
        break;
      case "portfolio":
        if (args.length < 2) {
          //print all the commands if the arguments arent correct
          const portfolioEmbed = new Discord.MessageEmbed()
            .setTitle("Stock Arguments:")
            .setColor("#ff4242")
            .addFields(
              {
                name: "create [portfolio name]",
                value: "Create a portfolio with your desired name.",
              },
              {
                name: "delete [portfolio number]",
                value: "Delete an empty portfolio.",
              },
              {
                name:
                  "transfer [portfolio location #] [portfolio destination #] [ticker] [amount of stock]",
                value: "Transfer stocks form one portfolio to another.",
              },
              {
                name: "view [portfolio number]",
                value: "View a specific portfolio, or leave empty to view all.",
              }
            );
          return message.reply(portfolioEmbed);
        }
        switch (args[1]) {
          case "create":
            if (args.length < 3) return message.reply("Incorrect arguments.");
            if (arrIndex < 0) {
              dbFunction.createStockUser(message.author.id).then(() => {
                arrIndex = dbObjects.stocks.length - 1;
                let portfolioName = args[2];
                if (args.length > 3) {
                  for (let i = 3; i < args.length; i++) {
                    portfolioName += ` ${args[i]}`;
                  }
                }
                dbFunction.createPortfolio(
                  message.author.id,
                  arrIndex,
                  portfolioName
                );
                message.reply(`${portfolioName} has been created.`);
              });
            } else {
              let portfolioName = args[2];
              if (args.length > 3) {
                for (let i = 3; i < args.length; i++) {
                  portfolioName += ` ${args[i]}`;
                }
              }
              for (
                let i = 0;
                i < dbObjects.stocks[arrIndex].portfolio.length;
                i++
              ) {
                if (
                  dbObjects.stocks[arrIndex].portfolio[i].portfolioName ===
                  portfolioName
                ) {
                  return message.reply(
                    "You already have a portfolio with that name."
                  );
                }
              }
              dbFunction.createPortfolio(
                message.author.id,
                arrIndex,
                portfolioName
              );
              return message.reply(`${portfolioName} has been created.`);
            }
            break;
          case "delete":
            if (args.length < 3) return message.reply("Incorrect arguments.");
            if (
              arrIndex < 0 ||
              dbObjects.stocks[arrIndex].portfolio.length === 0
            )
              return message.reply("Create a portfolio first.");
            if (isNaN(args[2]))
              return message.reply("Incorrect portfolio number.");
            if (
              parseFloat(args[2]) - 1 >
                dbObjects.stocks[arrIndex].portfolio.length - 1 ||
              parseFloat(args[2]) - 1 < 0
            )
              return message.reply("Incorrect portfolio number.");
            if (
              dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2]) - 1]
                .stocks.length > 0
            )
              return message.reply("Clear your portfolio first.");
            dbFunction.deletePortfolio(
              message.author.id,
              arrIndex,
              parseFloat(args[2]) - 1,
              dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2]) - 1]
                .portfolioName
            );
            return message.reply(
              `${
                dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2]) - 1]
                  .portfolioName
              } has been deleted.`
            );
            break;
          case "transfer":
            if (args.length < 6) return message.reply("Incorrect arguments.");
            if (isNaN(args[2]) || isNaN(args[3]) || isNaN(args[5]))
              return message.reply("Use [~s] to see the correct arguments.");
            if (arrIndex < 0 || dbObjects.stocks[arrIndex].portfolio.length < 2)
              return message.reply("Create a portfolio and buy stock first.");
            if (
              parseFloat(args[2]) - 1 >
                dbObjects.stocks[arrIndex].portfolio.length - 1 ||
              parseFloat(args[2]) - 1 < 0 ||
              parseFloat(args[3]) - 1 >
                dbObjects.stocks[arrIndex].portfolio.length - 1 ||
              parseFloat(args[3]) - 1 < 0
            )
              return message.reply("Incorrect portfolio number.");
            if (parseFloat(args[5]) < 0)
              return message.reply("Incorrect stock amount.");
            if (parseFloat(args[2]) === parseFloat(args[3]))
              return message.reply(
                "No need to transfer is they're the same portfolio."
              );
            let stockIndex = -1;
            for (
              let i = 0;
              i <
              dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2]) - 1]
                .stocks.length;
              i++
            ) {
              if (
                dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2]) - 1]
                  .stocks[i].name === args[4].toUpperCase()
              )
                stockIndex = i;
            }
            if (stockIndex < 0)
              return message.reply(
                `Couldn't find ${args[4].toUpperCase()} in ${
                  dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2]) - 1]
                    .portfolioName
                }.`
              );
            if (
              parseFloat(args[5]) >
              dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2]) - 1]
                .stocks[stockIndex].amount
            )
              return message.reply(
                `You need ${
                  parseFloat(args[5]) -
                  dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2]) - 1]
                    .stocks[stockIndex].amount
                } more stock of ${
                  dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2]) - 1]
                    .stocks[stockIndex].name
                } to cover this transfer.`
              );
            let desStockIndex = -1;
            for (
              let i = 0;
              i <
              dbObjects.stocks[arrIndex].portfolio[parseFloat(args[3]) - 1]
                .stocks.length;
              i++
            ) {
              if (
                dbObjects.stocks[arrIndex].portfolio[parseFloat(args[3]) - 1]
                  .stocks[i].name ===
                dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2]) - 1]
                  .stocks[stockIndex].name
              )
                desStockIndex = i;
            }
            if (desStockIndex > -1) {
              dbFunction.updateStock(
                arrIndex,
                desStockIndex,
                message.author.id,
                dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2]) - 1]
                  .stocks[stockIndex].name,
                parseFloat(args[5]),
                (dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2]) - 1]
                  .stocks[stockIndex].price /
                  dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2]) - 1]
                    .stocks[stockIndex].amount) *
                  parseFloat(args[5]),
                dbObjects.stocks[arrIndex].portfolio[parseFloat(args[3]) - 1]
                  .portfolioName,
                parseFloat(args[3]) - 1,
                0
              );
            } else
              dbFunction.addStock(
                arrIndex,
                message.author.id,
                dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2]) - 1]
                  .stocks[stockIndex].name,
                parseFloat(args[5]),
                (dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2]) - 1]
                  .stocks[stockIndex].price /
                  dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2]) - 1]
                    .stocks[stockIndex].amount) *
                  parseFloat(args[5]),
                dbObjects.stocks[arrIndex].portfolio[parseFloat(args[3]) - 1]
                  .portfolioName,
                parseFloat(args[3]) - 1,
                0
              );

            if (
              parseFloat(args[5]) ===
              dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2]) - 1]
                .stocks[stockIndex].amount
            ) {
              dbFunction.deleteStock(
                message.author.id,
                dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2]) - 1]
                  .portfolioName,
                dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2]) - 1]
                  .stocks[stockIndex].name,
                arrIndex,
                parseFloat(args[2]) - 1,
                stockIndex,
                0
              );
            } else {
              let price =
                (dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2]) - 1]
                  .stocks[stockIndex].price /
                  dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2]) - 1]
                    .stocks[stockIndex].amount) *
                parseFloat(args[5]);
              dbFunction.updateStock(
                arrIndex,
                stockIndex,
                message.author.id,
                dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2]) - 1]
                  .stocks[stockIndex].name,
                -parseFloat(args[5]),
                -price,
                dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2]) - 1]
                  .portfolioName,
                parseFloat(args[2]) - 1,
                0
              );
            }

            message.reply(
              `Transfer of ${parseFloat(
                args[5]
              )} ${args[4].toUpperCase()} from ${
                dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2]) - 1]
                  .portfolioName
              } to ${
                dbObjects.stocks[arrIndex].portfolio[parseFloat(args[3]) - 1]
                  .portfolioName
              } has been complete.`
            );
            break;
          case "view":
            if (
              arrIndex < 0 ||
              dbObjects.stocks[arrIndex].portfolio.length === 0
            )
              return message.reply("Create a portfolio first.");
            if (isNaN(args[2])) {
              let portfolioEmbed = new Discord.MessageEmbed()
                .setTitle(`${message.author.username}'s Portfolios:`)
                .setDescription(
                  `Cash: ${dbObjects.stocks[arrIndex].cash.toLocaleString()}:`
                )
                .setColor("#ff4242")
                .setTimestamp();
              let portfolioNames = `1) ${dbObjects.stocks[arrIndex].portfolio[0].portfolioName}\n`;
              if (dbObjects.stocks[arrIndex].portfolio.length > 1) {
                for (
                  let i = 1;
                  i < dbObjects.stocks[arrIndex].portfolio.length;
                  i++
                ) {
                  portfolioNames += `${i + 1}) ${
                    dbObjects.stocks[arrIndex].portfolio[i].portfolioName
                  }\n`;
                }
              }

              portfolioEmbed.addField(portfolioNames, `\u200b`);
              message.channel.send(portfolioEmbed);
              // console.log(dbObjects.stocks[arrIndex].portfolio[i]);
              return;
            }
            if (
              parseFloat(args[2]) - 1 >
                dbObjects.stocks[arrIndex].portfolio.length - 1 ||
              parseFloat(args[2]) - 1 < 0
            )
              return message.reply("Incorrect portfolio number.");
            if (
              dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2] - 1)]
                .stocks.length === 0
            )
              return message.reply("There is nothing in this portfolio.");

            for (
              let i = 0;
              i <
              dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2] - 1)]
                .stocks.length;
              i++
            ) {
              try {
                this.getQuote(
                  dbObjects.stocks[arrIndex].portfolio[parseFloat(args[2] - 1)]
                    .stocks[i].name
                ).then((quotes) => {
                  let portfolioEmbed = new Discord.MessageEmbed()
                    .setTitle(
                      `${
                        dbObjects.stocks[arrIndex].portfolio[
                          parseFloat(args[2] - 1)
                        ].portfolioName
                      }'s Details`
                    )
                    .setDescription(
                      `Cash: ${dbObjects.stocks[
                        arrIndex
                      ].cash.toLocaleString()}:`
                    )
                    .setColor("#ff4242")
                    .setTimestamp()
                    .setFooter(message.author.username)
                    .addField(
                      dbObjects.stocks[arrIndex].portfolio[
                        parseFloat(args[2] - 1)
                      ].stocks[i].name,
                      `Current Price: $${quotes.price.regularMarketPrice.toLocaleString()}\n
                      Shares: ${
                        dbObjects.stocks[arrIndex].portfolio[
                          parseFloat(args[2] - 1)
                        ].stocks[i].amount
                      }\n
                      Average Cost: $${(
                        dbObjects.stocks[arrIndex].portfolio[
                          parseFloat(args[2] - 1)
                        ].stocks[i].price /
                        dbObjects.stocks[arrIndex].portfolio[
                          parseFloat(args[2] - 1)
                        ].stocks[i].amount
                      ).toLocaleString()}\n
                      Market Value: $${(
                        dbObjects.stocks[arrIndex].portfolio[
                          parseFloat(args[2] - 1)
                        ].stocks[i].amount * quotes.price.regularMarketPrice
                      ).toLocaleString()}\n
                      Total Return: $${(
                        dbObjects.stocks[arrIndex].portfolio[
                          parseFloat(args[2] - 1)
                        ].stocks[i].amount *
                          quotes.price.regularMarketPrice -
                        dbObjects.stocks[arrIndex].portfolio[
                          parseFloat(args[2] - 1)
                        ].stocks[i].price
                      ).toLocaleString()} (${(
                        ((dbObjects.stocks[arrIndex].portfolio[
                          parseFloat(args[2] - 1)
                        ].stocks[i].amount *
                          quotes.price.regularMarketPrice -
                          dbObjects.stocks[arrIndex].portfolio[
                            parseFloat(args[2] - 1)
                          ].stocks[i].price) /
                          dbObjects.stocks[arrIndex].portfolio[
                            parseFloat(args[2] - 1)
                          ].stocks[i].price) *
                        100
                      ).toLocaleString()}%)\n`,
                      true
                    );
                  setTimeout(function () {}, 500);
                  message.channel.send(portfolioEmbed);
                });
              } catch (error) {
                message.reply("There was an error printing your portfolio.");
              }
            }
            break;
        }
        break;
    }
  },

  getQuote: async function (ticker) {
    return new Promise((resolve) => {
      try {
        yahooFinance.quote(
          {
            symbol: ticker,
            modules: ["price", "summaryDetail"], // see the docs for the full list
          },
          function (err, quotes) {
            // console.log(quotes);
            resolve(quotes);
          }
        );
      } catch (error) {}
    });
  },
};
