const express = require("express");
const path = require("path");
const cors = require("cors")
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(cors())
const port=process.env.PORT || 3000
const dbPath = path.join(__dirname, "chatapp.db");

let db = null;

const initializeDBAndServer = async () => {ś
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();
app.use(express.json());

app.get("/", async (request, response) => {
    const getBookQuery = `
      SELECT
        *
      FROM
        users`;
    const book = await db.all(getBookQuery);
    response.send(book);
  });