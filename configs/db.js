const { connect, set } = require("mongoose");
const config = require("./env")

const connection = async () => {
  try {
    set("strictQuery", true);
    await connect(config.mongodb.url, {
    });
    console.log("App connected to database ✔");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connection;

