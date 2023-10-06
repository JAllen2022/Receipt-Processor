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

  // Patterns expected for all fields
  const retailerPattern = /^[a-zA-Z0-9& ]+$/; //  <-- This differs from what is in API file to account for example case in the instructions README file.
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
  const shortDescriptionPattern = /^[\w\s\-]+$/;
  const pricePattern = /^\d+\.\d{2}$/;

  // Check if all required fields are present
  for (let field of requiredFields) {
    if (!receipt[field]) {
      return res.status(400).json({ error: `Field ${field} is required.` });
    }
  }

  // Validate retailer
  if (
    typeof receipt.retailer !== "string" ||
    !retailerPattern.test(receipt.retailer)
  ) {
    return res.status(400).json({ error: "Invalid retailer format." });
  }

  // Validate purchaseDate
  if (!datePattern.test(receipt.purchaseDate)) {
    return res.status(400).json({
      error: "Invalid purchase date format. Expected YYYY-MM-DD.",
    });
  }

  // Validate purchaseTime
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
      !shortDescriptionPattern.test(item.shortDescription)
    ) {
      return res.status(400).json({
        error: "Invalid shortDescription format in items.",
      });
    }

    if (typeof item.price !== "string" || !pricePattern.test(item.price)) {
      return res.status(400).json({
        error: "Invalid price format in items. Expected XX.XX.",
      });
    }
  }

  // Validate total
  if (typeof receipt.total !== "string" || !pricePattern.test(receipt.total)) {
    return res.status(400).json({
      error: "Invalid total. Expected XX.XX.",
    });
  }

  // If everything's valid, proceed
  next();
}

module.exports = { validateReceipt };
