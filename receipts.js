const { v4: uuidv4 } = require("uuid");
const { calculatePoints } = require("./helper-functions");

// In memory storage to keep track of different receipts and their points
const receipts = {};

// POST /receipts/process. This endpoint will receive a JSON object in the request body.
function saveReceipt(req, res) {
  const receipt = req.body;
  const id = uuidv4();
  const points = calculatePoints(receipt);

  receipts[id] = {
    receipt,
    points,
  };

  res.json({ id });
}

// GET /receipts/:id/points. This endpoint will return the number of points for a given receipt.
function getPoints(req, res) {
  const id = req.params.id;
  if (!receipts[id]) {
    return res.status(404).json({ error: `No receipt found for that id` });
  }
  res.json({ points: receipts[id].points });
}

module.exports = {
  saveReceipt,
  getPoints,
};
