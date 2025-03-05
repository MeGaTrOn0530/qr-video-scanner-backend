const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Datastore = require("nedb");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Ma'lumotlar bazasi
const db = new Datastore({ filename: "data.db", autoload: true });

// API: Barcha rasmlar va videolarni olish
app.get("/api/pairs", (req, res) => {
  db.find({}, (err, docs) => {
    if (err) {
      res.status(500).json({ error: "Ma'lumotlarni olishda xatolik" });
    } else {
      res.json(docs);
    }
  });
});

// API: Yangi rasm va videoni saqlash
app.post("/api/pairs", (req, res) => {
  const { name, image, video } = req.body;
  if (!name || !image || !video) {
    return res.status(400).json({ error: "Barcha maydonlar talab qilinadi" });
  }

  const newPair = { name, image, video, date: new Date().toISOString() };
  db.insert(newPair, (err, newDoc) => {
    if (err) {
      res.status(500).json({ error: "Saqlashda xatolik" });
    } else {
      res.json(newDoc);
    }
  });
});

// API: Rasm va videoni o‘chirish
app.delete("/api/pairs/:id", (req, res) => {
  const { id } = req.params;
  db.remove({ _id: id }, {}, (err, numRemoved) => {
    if (err) {
      res.status(500).json({ error: "O‘chirishda xatolik" });
    } else {
      res.json({ success: true, message: "Juftlik o‘chirildi" });
    }
  });
});

// Serverni ishga tushirish
app.listen(port, () => {
  console.log(`Server ishlayapti: http://localhost:${port}`);
});
