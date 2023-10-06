const express = require("express");
const bodyParser = require("body-parser");
const { saveReceipt, getPoints } = require("./receipts.js");
const { validateReceipt } = require("./helper-functions.js");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post("/receipts/process", validateReceipt, saveReceipt);
app.get("/receipts/:id/points", getPoints);

app.listen(PORT, () => {
  console.log(`Server is listening to port:${PORT}`);
});
