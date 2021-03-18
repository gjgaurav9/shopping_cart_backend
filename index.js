const sqlite3 = require("sqlite3");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const HTTP_PORT = 8000;
app.listen(HTTP_PORT, () => {
  console.log("Server is listening on port " + HTTP_PORT);
});

const db = new sqlite3.Database("./cart_database.db", (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {
    db.run(
      "CREATE TABLE items( \
            item_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
            item_name NVARCHAR(20)  NOT NULL,\
            category NVARCHAR(20)  NOT NULL,\
            price INTEGER(20),\
            available_quantity INTEGER\
        )",
      (err) => {
        if (err) {
          console.log("Table already exists.");
        }
        let insert =
          "INSERT INTO items (item_name, category, price, available_quantity) VALUES (?,?,?,?)";
        db.run(insert, ["Canon EOD 20D", "Camera", 20000, 3]);
        db.run(insert, ["Adidas Light runner Juice it", "Shoes", 2000, 2]);
        db.run(insert, ["Real Apple", "Juice", 50, 6]);
      }
    );
  }
});

app.get("/items/:id", (req, res, next) => {
  var params = [req.params.id];
  db.get(
    "SELECT * FROM items where item_id = ?",
    [req.params.id],
    (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(200).json(row);
    }
  );
});

app.get("/items", (req, res, next) => {
  db.all("SELECT * FROM items", [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(200).json({ rows });
  });
});