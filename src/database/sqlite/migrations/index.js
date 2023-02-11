const sqliteConnection = require("../../sqlite");
const createUsers = require("./createUsers");

async function migrationsRun() {
  const schema = [
    createUsers
  ].join(",")

  await sqliteConnection().then(db => db.exec(schema)).catch(err => console.log(err));
}

module.exports = migrationsRun;