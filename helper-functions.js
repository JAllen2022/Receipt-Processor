// Helper function to calculate points for a given receipt
function calculatePoints(receipt) {
  let points = 0;

  // Rule 1: One point for every alphanumeric character in the retailer name.
  if (receipt.retailer && typeof receipt.retailer === "string") {
    points += (receipt.retailer.match(/[a-zA-Z0-9]/g) || []).length;
  }

  // Rule 2: 50 points if the total is a round dollar amount with no cents.
  // Rule 3:25 points if the total is a multiple of 0.25.
  // First, ensure that the total exists and is a number
  if (receipt.total && !isNaN(parseInt(receipt.total))) {
    // Rule 2:
    const total = parseFloat(receipt.total);
    const check = Math.floor(total);
    if (total === check) {
      points += 50;
    }

    // Rule 3:
    if (total % 0.25 === 0) {
      points += 25;
    }
  }

  // Rule 4: 5 points for every two items on the receipt.
  // Rule 5: If the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round up to the nearest integer.
  if (receipt.items && Array.isArray(receipt.items)) {
    const items = receipt.items;

    points += 5 * Math.floor(items.length / 2);

    items.forEach((item) => {
      if (item.shortDescription.trim().length % 3 === 0) {
        points += Math.ceil(parseFloat(item.price) * 0.2);
      }
    });
  }

  // Rule 6: 6 points if the day in the purchase date is odd.
  if (typeof receipt.purchaseDate === "string") {
    const date = receipt.purchaseDate.split("-");
    const day = parseInt(date[2]);
    if (day % 2 === 1) {
      points += 6;
    }
  }

  // Rule 7: 10 points if the time of purchase is after 2:00pm and before 4:00pm.
  if (typeof receipt.purchaseTime === "string") {
    const purchaseTime = receipt.purchaseTime.split(":");
    const time = parseInt(purchaseTime[0]);
    if (time[0] >= 14 && time[0] < 16) {
      points += 10;
    }
  }

  return points;
}

// Helper middleware function to validate receipt object received in request body
function validateReceipt(req, res, next) {
  const receipt = req.body;

  // Required fields for the receipt object
  const requiredFields = [
    "retailer",
    "purchaseDate",
    "purchaseTime",
    "items",
    "total",
  ];

  // Check if all required fields are present
  for (let field of requiredFields) {
    if (!receipt[field]) {
      return res.status(400).json({ error: `Field ${field} is required.` });
    }
  }

  // Validate retailer
  if (typeof receipt.retailer !== "string" || !/^\S+$/.test(receipt.retailer)) {
    return res.status(400).json({ error: "Invalid retailer format." });
  }

  // Validate purchaseDate
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(receipt.purchaseDate)) {
    return res.status(400).json({
      error: "Invalid purchase date format. Expected YYYY-MM-DD.",
    });
  }

  // Validate purchaseTime
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timePattern.test(receipt.purchaseTime)) {
    return res.status(400).json({
      error: "Invalid purchase time format. Expected HH:MM in 24-hour format.",
    });
  }

  // Validate items
  if (!Array.isArray(receipt.items) || receipt.items.length === 0) {
    return res.status(400).json({
      error: "Items should be an array with at least one item.",
    });
  }

  // Validate short description for receipt item
  for (let item of receipt.items) {
    if (
      !item.hasOwnProperty("shortDescription") ||
      !item.hasOwnProperty("price")
    ) {
      return res.status(400).json({
        error: "Each item should have a shortDescription and price.",
      });
    }

    if (
      typeof item.shortDescription !== "string" ||
      !/^[\w\s\-]+$/.test(item.shortDescription)
    ) {
      return res.status(400).json({
        error: "Invalid shortDescription format in items.",
      });
    }

    if (typeof item.price !== "string" || !/^\d+\.\d{2}$/.test(item.price)) {
      return res.status(400).json({
        error: "Invalid price format in items. Expected XX.XX.",
      });
    }
  }

  // Validate total
  if (
    typeof receipt.total !== "string" ||
    !/^\d+\.\d{2}$/.test(receipt.total)
  ) {
    return res.status(400).json({
      error: "Invalid total. Expected XX.XX.",
    });
  }

  // If everything's valid, proceed
  next();
}

module.exports = { calculatePoints, validateReceipt };
