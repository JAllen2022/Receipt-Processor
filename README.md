## **Receipt Points Calculator**

### **Overview**

This application processes receipts and calculates points based on certain criteria, such as retailer name, purchase date and time, and items. It provides two primary endpoints: one for processing receipts and another for fetching the calculated points for a given receipt.

### **API Endpoints**

#### `POST /receipts/process`

Accepts a receipt in JSON format and returns a unique ID for the receipt. The receipt should adhere to the specified format (as described in the schema).

**Request Body**

- `retailer`: Name of the retailer or store (must match pattern `^\S+$`).
- `purchaseDate`: Date of the purchase in format `YYYY-MM-DD`.
- `purchaseTime`: Time of the purchase in 24-hour format `HH:MM`.
- `items`: An array of purchased items, where each item has:
  - `shortDescription`: Description of the item (pattern `^[\w\s\-]+$`).
  - `price`: Price of the item in format `X.XX`.
- `total`: Total amount paid on the receipt in format `X.XX`.

#### `GET /receipts/:id/points`

Returns the calculated points for a receipt using its unique ID.

### **Development & Deployment**

#### **Running with Node.js**

1. Install Node.js and npm (Node package manager).
2. Navigate to the project directory.
3. Run `npm install` to install dependencies.
4. Run `npm start` to start the application.

#### **Running with Docker**

1. Ensure you have Docker installed on your machine.
2. Navigate to the project directory.
3. Build the Docker image:
   ```
   docker build -t receipt-points-calculator .
   ```
4. Run the Docker container:
   ```
   docker run -p 3000:3000 receipt-points-calculator
   ```

Now, the application should be up and running on `http://localhost:3000`.


## Examples

```json
{
  "retailer": "Target",
  "purchaseDate": "2022-01-01",
  "purchaseTime": "13:01",
  "items": [
    {
      "shortDescription": "Mountain Dew 12PK",
      "price": "6.49"
    },{
      "shortDescription": "Emils Cheese Pizza",
      "price": "12.25"
    },{
      "shortDescription": "Knorr Creamy Chicken",
      "price": "1.26"
    },{
      "shortDescription": "Doritos Nacho Cheese",
      "price": "3.35"
    },{
      "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
      "price": "12.00"
    }
  ],
  "total": "35.35"
}
```
```text
Total Points: 28
Breakdown:
     6 points - retailer name has 6 characters
    10 points - 4 items (2 pairs @ 5 points each)
     3 Points - "Emils Cheese Pizza" is 18 characters (a multiple of 3)
                item price of 12.25 * 0.2 = 2.45, rounded up is 3 points
     3 Points - "Klarbrunn 12-PK 12 FL OZ" is 24 characters (a multiple of 3)
                item price of 12.00 * 0.2 = 2.4, rounded up is 3 points
     6 points - purchase day is odd
  + ---------
  = 28 points
```

----

```json
{
  "retailer": "M&M Corner Market",
  "purchaseDate": "2022-03-20",
  "purchaseTime": "14:33",
  "items": [
    {
      "shortDescription": "Gatorade",
      "price": "2.25"
    },{
      "shortDescription": "Gatorade",
      "price": "2.25"
    },{
      "shortDescription": "Gatorade",
      "price": "2.25"
    },{
      "shortDescription": "Gatorade",
      "price": "2.25"
    }
  ],
  "total": "9.00"
}
```
```text
Total Points: 109
Breakdown:
    50 points - total is a round dollar amount
    25 points - total is a multiple of 0.25
    14 points - retailer name (M&M Corner Market) has 14 alphanumeric characters
                note: '&' is not alphanumeric
    10 points - 2:33pm is between 2:00pm and 4:00pm
    10 points - 4 items (2 pairs @ 5 points each)
  + ---------
  = 109 points
```
