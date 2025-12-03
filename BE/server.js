// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const router = require('./routes/routes');
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

const PORT = process.env.PORT || 5000;

const root = path.resolve();
app.use(express.static(path.join(root, '/FE/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(root, '/FE/dist/index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
