const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// પ્રોડક્ટ મુજબ રિવ્યુ મેળવવા
router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// નવો રિવ્યુ ઉમેરવા
router.post("/add", async (req, res) => {
  try {
    const { productId, userId, userName, rating, comment } = req.body;
    const newReview = new Review({ productId, userId, userName, rating, comment });
    await newReview.save();
    res.status(201).json({ success: true, message: "Review added!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;