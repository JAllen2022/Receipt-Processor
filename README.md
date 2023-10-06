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
