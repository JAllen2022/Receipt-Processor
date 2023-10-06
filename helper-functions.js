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
    const purchaseTime = receipt.purchaseTime
      .split(":")
      .map((num) => parseInt(num));
    const hour = purchaseTime[0];
    const minute = purchaseTime[1];
    if ((hour === 14 && minute > 0) || hour === 15) {
      points += 10;
    }
  }

  return points;
}

module.exports = { calculatePoints };
