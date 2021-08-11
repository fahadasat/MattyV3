const mongo = require("../mongo");
const userDtlsSchema = require("../schemas/userDtlsSchema");
const moviesSchema = require("../schemas/moviesSchema");
const stocksSchema = require("../schemas/stocksSchema");
const dbObjects = require("../db/dbObjects");
const mongoose = require("mongoose");

//function to load the dtls table into the js object
module.exports = {
  loadData: async function () {
    try {
      //query returns the whole table

      //load user details
      await userDtlsSchema
        .find(
          {
            // _id: id,
          },
          (error, data) => {
            if (error) {
              console.log(error);
            } else {
              dbObjects.userDtls = data;
            }
          }
        )
        .exec();

      //load movies
      await moviesSchema
        .find(
          {
            // _id: id,
          },
          (error, data) => {
            if (error) {
              console.log(error);
            } else {
              dbObjects.movies = data;
            }
          }
        )
        .exec();

      //load stocks
      await stocksSchema
        .find(
          {
            // _id: id,
          },
          (error, data) => {
            if (error) {
              console.log(error);
            } else {
              dbObjects.stocks = data;
            }
          }
        )
        .exec();
    } catch (err) {
      console.log(`error loading data in dbFunction.js ${err}`);
    }
  },

  //try to see if the user is in the array,
  //if it is then return the value of the average messages
  //if the user isnt in the array then that means they dont have any sent msgs
  getAvgMessages: function (id) {
    try {
      let userDetails = dbObjects.userDtls.find((user) => user._id === id);
      return userDetails.avgMessage;
    } catch {
      return 0;
    }

    //this way is to get the value from the database instead of the js array

    // await mongo().then(async (mongoose) => {
    //   try {
    //     await userDtlsSchema
    //       .find(
    //         {
    //           _id: id,
    //         },
    //         function (err, result) {
    //           if (err) {
    //             return;
    //           } else {
    //             avg = result.avgMessage;
    //           }
    //         }
    //       )
    //       .exec();
    //   } catch (err) {
    //     console.log(err);
    //   } finally {
    //     mongoose.connection.close();
    //   }
    // });
  },

  //try to see if the user is in the array,
  //if it is then return the value of the total messages
  //if the user isnt in the array then that means they dont have any sent msgs
  getTotalMessages: function (id) {
    try {
      let userDetails = dbObjects.userDtls.find((user) => user._id === id);
      return userDetails.totalMessage;
    } catch {
      return 0;
    }
  },

  //try to see if the user is in the array,
  //if it is then return the time the user spent in VC
  //if the user isnt in the array then that means they haven't spent any time in VC
  getTotalVC: function (id) {
    try {
      let userDetails = dbObjects.userDtls.find((user) => user._id === id);
      return userDetails.totalTimeVC;
    } catch {
      return 0;
    }
  },

  //try to see if the user is in the array,
  //if it is then return the time the user spent in VC this month
  //if the user isnt in the array then that means they haven't spent any time in VC this month
  getAvgVC: function (id) {
    try {
      let userDetails = dbObjects.userDtls.find((user) => user._id === id);
      return userDetails.avgVC;
    } catch {
      return 0;
    }
  },

  //add a movie to the movies collection and movies object
  addMovie: async function (inserted) {
    try {
      movieId = mongoose.Types.ObjectId();
      await moviesSchema.create({
        _id: movieId,
        name: inserted.trim(),
      });
      dbObjects.movies.push({
        _id: movieId,
        name: inserted.trim(),
      });
      return `${inserted.trim()} has been added to the database.`;
    } catch (err) {
      console.log(`error adding movie in dbFunction.js ${err}`);
      return `${inserted.trim()} was not added to the database due to an error.`;
    }
  },

  //remove a movie from the movies collection and movies object
  removeMovie: async function (inserted) {
    try {
      //remove the movie from db object and database
      let index = dbObjects.movies.findIndex(
        (movie) => movie.name === inserted.trim()
      );
      if (index > -1) {
        //remove from the movies object
        dbObjects.movies.splice(index, 1);
        //remove from the database
        await moviesSchema.findOneAndDelete({
          name: inserted.trim(),
        });
        return `${inserted.trim()} has been removed from the database.`;
      }
      return `${inserted.trim()} was not found in the database.`;
    } catch (err) {
      console.log(`error adding movie in dbFunction.js ${err}`);
      return `${inserted.trim()} was not found in the database.`;
    }
  },

  //create new user for the stock game
  createStockUser: async function (id) {
    try {
      await stocksSchema.create({
        _id: id,
        watchlist: [],
        cash: 50000,
        portfolio: [],
      });
      dbObjects.stocks.push({
        _id: id,
        watchlist: [],
        cash: 50000,
        portfolio: [],
      });
    } catch (err) {
      console.log(`error adding stock user in dbFunction.js ${err}`);
    }
  },

  createPortfolio: async function (id, index, name) {
    try {
      await stocksSchema
        .findOneAndUpdate(
          {
            _id: id,
          },
          {
            $push: {
              portfolio: {
                portfolioName: name,
                stocks: [],
              },
            },
          },
          {
            upsert: true,
          }
        )
        .exec();
      dbObjects.stocks[index].portfolio.push({
        portfolioName: name,
        stocks: [],
      });
    } catch (error) {
      console.log(error);
    }
  },

  deletePortfolio: async function (id, index, portFolioIndex, name) {
    try {
      await stocksSchema
        .findOneAndUpdate(
          {
            _id: id,
          },
          {
            $pull: {
              portfolio: {
                portfolioName: name,
              },
            },
          },
          {
            upsert: true,
          }
        )
        .exec();

      dbObjects.stocks[index].portfolio.splice(portFolioIndex, 1);
    } catch (error) {
      console.log(error);
    }
  },

  addStock: async function (
    index,
    id,
    ticker,
    amount,
    price,
    portfolioName,
    portfolioIndex,
    cash
  ) {
    try {
      await stocksSchema
        .findOneAndUpdate(
          {
            _id: id,
            portfolio: { $elemMatch: { portfolioName: portfolioName } },
          },
          {
            $push: {
              "portfolio.$.stocks": {
                name: ticker,
                amount: amount,
                price: price,
              },
            },
            $inc: {
              cash: -cash,
            },
          },
          {
            upsert: true,
          }
        )
        .exec();

      dbObjects.stocks[index].portfolio[portfolioIndex].stocks.push({
        name: ticker,
        amount: amount,
        price: price,
      });
      dbObjects.stocks[index].cash -= cash;
    } catch (error) {
      console.log(error);
    }
  },

  // //create update stock if the stock ticker is found
  updateStock: async function (
    userIndex,
    stockIndex,
    id,
    ticker,
    amount,
    price,
    portfolioName,
    portfolioIndex,
    cash
  ) {
    let amountQuery = `portfolio.$.stocks.${stockIndex}.amount`;
    let priceQuery = `portfolio.$.stocks.${stockIndex}.price`;
    try {
      await stocksSchema
        .findOneAndUpdate(
          {
            _id: id,

            portfolio: {
              $elemMatch: {
                portfolioName: portfolioName,
                "stocks.name": ticker,
              },
            },
          },

          {
            $inc: {
              cash: -cash,
              [amountQuery]: amount,
              [priceQuery]: price,
            },
          },
          {
            upsert: true,
          }
        )
        .exec();

      dbObjects.stocks[userIndex].portfolio[portfolioIndex].stocks[
        stockIndex
      ].amount += amount;
      dbObjects.stocks[userIndex].portfolio[portfolioIndex].stocks[
        stockIndex
      ].price += price;
      dbObjects.stocks[userIndex].cash -= cash;
    } catch (error) {
      console.log(error);
    }
  },

  deleteStock: async function (
    id,
    portfolioName,
    ticker,
    userIndex,
    portfolioIndex,
    stockIndex,
    cash
  ) {
    // let stockQuery = `portfolio.$.stocks`;
    try {
      await stocksSchema
        .findOneAndUpdate(
          {
            _id: id,
            portfolio: {
              $elemMatch: {
                portfolioName: portfolioName,
                "stocks.name": ticker,
              },
            },
          },
          {
            $inc: {
              cash: cash,
            },
            $pull: {
              "portfolio.$.stocks": {
                name: ticker,
              },
            },
          },
          {
            upsert: true,
          }
        )
        .exec();
    } catch (error) {
      console.log(error);
    }
    dbObjects.stocks[userIndex].cash += cash;
    dbObjects.stocks[userIndex].portfolio[portfolioIndex].stocks.splice(
      stockIndex,
      1
    );
  },

  addWatchlist: async function (id, ticker, userIndex) {
    try {
      await stocksSchema
        .findOneAndUpdate(
          {
            _id: id,
          },
          {
            $push: {
              watchlist: ticker,
            },
          },
          {
            upsert: true,
          }
        )
        .exec();
    } catch (error) {
      console.log(error);
    }

    dbObjects.stocks[userIndex].watchlist.push(ticker);
  },

  removeWatchlist: async function (id, ticker, userIndex, tickerIndex) {
    try {
      await stocksSchema
        .findOneAndUpdate(
          {
            _id: id,
          },
          {
            $pull: {
              watchlist: ticker,
            },
          },
          {
            upsert: true,
          }
        )
        .exec();
    } catch (error) {
      console.log(error);
    }
    dbObjects.stocks[userIndex].watchlist.splice(tickerIndex, 1);
  },
};
