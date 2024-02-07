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


  app.post("/register", async (request, response) => {
    try {
      const { userName, name, password } = req.body;

      // Generate a unique user_id using uuid
      const user_id = uuidv4();

      // Insert data into the database
      db.run(`
          INSERT INTO users (id, username, name, password)
          VALUES (?, ?, ?, ?)
      `, [user_id, username, name, password], function (err) {
          if (err) {
              return res.status(500).json({ error: err.message });
          }

          // Return the user_id as a response
          res.status(201).json({ id: user_id });
      });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
  });

  app.post("/login", async (request, response) => {
    const { username, password } = request.body;
    const selectUserQuery = `SELECT * FROM users WHERE user_name = '${username}'`;
    const dbUser = await db.get(selectUserQuery);
  
    if (!dbUser || dbUser.password !== password) {
      response.status(401).json({ success: false, message: 'Invalid username or password' });
    } else {
      // You might want to exclude sensitive information like passwords before sending the user data
      const { password, ...user } = dbUser;
  
      response.json({ success: true, message: 'Login successful', user });
    }
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

  