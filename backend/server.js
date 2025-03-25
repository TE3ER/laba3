require("dotenv").config();
const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));
// Конфігурація бази даних
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: false,
  },
};

// Підключення до бази
async function connectDB() {
  try {
    await sql.connect(dbConfig);
    console.log("Connected to Azure MSSQL!");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

connectDB();

// API-запит для отримання даних
app.get("/users", async (req, res) => {
  try {
    let result = await sql.query("SELECT * FROM Users");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/reservations", async (req, res) => {
  try {
    let result = await sql.query("SELECT * FROM Reservations");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/reservations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let result = await sql.query(
      `SELECT * FROM Reservations WHERE reservationID = ${id}`
    );
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/reservations", async (req, res) => {
  try {
    const {
      customerID,
      hotelID,
      checkin,
      checkout,
      numberOfGuests,
      reservationComments,
    } = req.body;
    await sql.query(`
        INSERT INTO Reservations (customerID, hotelID, checkin, checkout, numberOfGuests, reservationComments)
        VALUES ('${customerID}', '${hotelID}', '${checkin}', '${checkout}', ${numberOfGuests}, '${reservationComments}')
      `);
    res.status(201).send("Reservation created successfully!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
