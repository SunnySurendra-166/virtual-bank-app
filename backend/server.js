const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]); // Helps with DNS issues

const app = express();

// ===============================
// MIDDLEWARE
// ===============================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://your-vercel-url.vercel.app"
    ]
  })
);


app.use(express.json());

// ===============================
// MODEL
// ===============================
const BankAccount = require("./models/BankAccount");

// ===============================
// MONGODB CONNECTION
// ===============================
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    family: 4,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

// ===============================
// ROOT ROUTE (Render Test)
// ===============================
app.get("/", (req, res) => {
  res.send("🏦 Virtual Bank Backend is Running");
});

// ===============================
// CREATE ACCOUNT (HASH PIN)
// ===============================
app.post("/create-account", async (req, res) => {
  try {
    const { name, pin, balance } = req.body;

    if (!name || !pin || balance === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (pin.length !== 4) {
      return res.status(400).json({ message: "PIN must be 4 digits" });
    }

    const hashedPin = await bcrypt.hash(pin, 10);
    const accountNumber = Math.floor(100000 + Math.random() * 900000);

    const newAccount = new BankAccount({
      accountNumber,
      name,
      pin: hashedPin,
      balance: Number(balance),
      transactions: [
        {
          type: "ACCOUNT_CREATED",
          amount: Number(balance),
          date: new Date(),
        },
      ],
    });

    await newAccount.save();

    res.status(201).json({
      message: "✅ Account created successfully",
      accountNumber,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===============================
// DEPOSIT
// ===============================
app.post("/deposit", async (req, res) => {
  try {
    const { accountNumber, amount } = req.body;

    if (!accountNumber || !amount) {
      return res.status(400).json({ message: "Account number and amount required" });
    }

    const account = await BankAccount.findOne({ accountNumber });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    account.balance += Number(amount);

    account.transactions.push({
      type: "DEPOSIT",
      amount: Number(amount),
      date: new Date(),
    });

    await account.save();

    res.json({
      message: "💰 Deposit successful",
      newBalance: account.balance,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===============================
// WITHDRAW (bcrypt compare)
// ===============================
app.post("/withdraw", async (req, res) => {
  try {
    const { accountNumber, pin, amount } = req.body;

    const account = await BankAccount.findOne({ accountNumber });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const isMatch = await bcrypt.compare(pin, account.pin);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid PIN" });
    }

    if (account.balance < Number(amount)) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    account.balance -= Number(amount);

    account.transactions.push({
      type: "WITHDRAW",
      amount: Number(amount),
      date: new Date(),
    });

    await account.save();

    res.json({
      message: "🏧 Withdrawal successful",
      newBalance: account.balance,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===============================
// ACCOUNT INFO (bcrypt compare)
// ===============================
app.post("/account-info", async (req, res) => {
  try {
    const { accountNumber, pin } = req.body;

    const account = await BankAccount.findOne({ accountNumber });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const isMatch = await bcrypt.compare(pin, account.pin);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid PIN" });
    }

    res.json({
      name: account.name,
      accountNumber: account.accountNumber,
      balance: account.balance,
      transactions: account.transactions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===============================
// TRANSFER (ATOMIC TRANSACTION)
// ===============================
app.post("/transfer", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { fromAccount, toAccount, pin, amount } = req.body;

    const sender = await BankAccount.findOne({ accountNumber: fromAccount }).session(session);
    const receiver = await BankAccount.findOne({ accountNumber: toAccount }).session(session);

    if (!sender || !receiver) {
      throw new Error("One or both accounts not found");
    }

    const isMatch = await bcrypt.compare(pin, sender.pin);
    if (!isMatch) {
      throw new Error("Invalid PIN");
    }

    if (sender.balance < Number(amount)) {
      throw new Error("Insufficient balance");
    }

    sender.balance -= Number(amount);
    receiver.balance += Number(amount);

    sender.transactions.push({
      type: "TRANSFER_SENT",
      amount: Number(amount),
      date: new Date(),
    });

    receiver.transactions.push({
      type: "TRANSFER_RECEIVED",
      amount: Number(amount),
      date: new Date(),
    });

    await sender.save({ session });
    await receiver.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: "💸 Transfer successful",
      senderBalance: sender.balance,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: error.message });
  }
});

// ===============================
// START SERVER (Render Compatible)
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
