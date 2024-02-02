const express = require("express");
const uuid = require("uuid")
const path = require("path");
const cors = require("cors")
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const { request } = require("http");
const app = express();
app.use(cors())
const port=process.env.PORT || 3000
const dbPath = path.join(__dirname, "chatapp.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("Server Running at http://localhost:5000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();
app.use(express.json());

app.get("/",async(request,response)=>{
  response.send("Checking if it works")
})

app.get("/manoj",async(request,response)=>{
  response.send("Hii Manoj")
})


app.get("/users/all", async (request, response) => {
    const getBookQuery = `
      SELECT
        *
      FROM
        users`;
    const book = await db.all(getBookQuery);
    response.send(book);
  });

  app.get("/users/usernames", async (request, response) => {
    const getBookQuery = `
      SELECT
        user_name
      FROM
        users`;
    const book = await db.all(getBookQuery);
    response.send(book);
  });

  app.get("/users/:userId/", async (request, response) => {
    const { userId } = request.params;
    const getBookQuery = `
      SELECT
        *
      FROM
        users
      WHERE
        user_id = "${userId}";`;
    const book = await db.get(getBookQuery);
    response.send(book);
  });

  app.get("/user_details/:userId/",async(request,response)=>{
    const { userId } = request.params;
    const getBookQuery = `
      SELECT
        *
      FROM
        user_details
      WHERE
        user_id = "${userId}";`;
    const book = await db.get(getBookQuery);
    response.send(book);
  })

  app.post("/users/", async (request, response) => {
    const bookDetails = request.body;
    const { userName,name,password } = bookDetails;
    const myId=uuid.v4()
    const addBookQuery = `
      INSERT INTO
        users ( user_id,user_name,name,password)
      VALUES
        (
          '${myId}',
          ${userName},
          ${name},
          ${password}
        );`;
  
    const dbResponse = await db.run(addBookQuery);
    const district_id = dbResponse.lastID;
    response.send("District Successfully Added");
  });

  app.post("/login", async (request, response) => {
    const { username, password } = request.body;
    const selectUserQuery = `SELECT * FROM users WHERE user_name = '${username}'`;
    const dbUser = await db.get(selectUserQuery);
    if (dbUser === undefined) {
      response.status(400);
      response.send("Invalid User");
    } else {
      const isPasswordMatched = password==dbUser.password;
      if (isPasswordMatched === true) {
        response.send("Login Success!");
      } else {
        response.status(400);
        response.send("Invalid Password");
      }
    }
  });