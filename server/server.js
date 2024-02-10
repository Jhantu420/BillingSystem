// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const abc = require("./model/abc");

const app = express();

// Parse incoming JSON payloads
app.use(express.json());
app.use(cors());

// MongoDB connection string - update it with your actual credentials and database name
const mongoUri = 'mongodb+srv://GolapSangha:kBIPLeeNb6wXiiak@cluster0.f50jr7x.mongodb.net/your-database-name';

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log("MongoDB connected");
  app.listen(1000, () => {
    console.log("App is running on port 1000");
  });
}).catch((error) => {   
  console.log(error);
});

// Save data to MongoDB
app.post("/abc", async (req, res) => {
  try {
    const xyz = await abc.create(req.body);
    res.status(200).json(xyz);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Fetch total earn and waste balances
app.get("/abc/totalBalances", async (req, res) => {
  try {
    const totalEarn = await abc.aggregate([
      { $match: { paid: true } }, // Match documents where paid is true for earn
      { $group: { _id: null, totalEarn: { $sum: "$earn_amount" } } } // Group and sum earn_amount
    ]);

    const totalWaste = await abc.aggregate([
      { $group: { _id: null, totalWaste: { $sum: "$waste_amount" } } } // Group and sum waste_amount
    ]);

    const reduceBalance = totalEarn.length > 0 && totalWaste.length > 0
      ? totalEarn[0].totalEarn - totalWaste[0].totalWaste
      : 0;

    const isBalanceReduced = totalWaste.length > 0 && totalWaste[0].totalWaste > totalEarn[0].totalEarn;

    const isBalanceMaintained = reduceBalance + totalWaste[0].totalWaste === totalEarn[0].totalEarn;

    res.status(200).json({
      totalEarn: totalEarn.length > 0 ? totalEarn[0].totalEarn : 0,
      totalWaste: totalWaste.length > 0 ? totalWaste[0].totalWaste : 0,
      reduceBalance,
      isBalanceReduced,
      isBalanceMaintained,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
