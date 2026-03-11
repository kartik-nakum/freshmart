const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// 1. Get user cart (GET) - for fetchCart()
router.get("/:userId", async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.json(cart ? cart.items : []);
    } catch (err) {
        res.status(500).json({ message: "Error fetching cart!" });
    }
});

// 2. Update
router.post("/update", async (req, res) => {
    const { userId, items } = req.body;
    
    if (!userId) return res.status(400).json({ message: "UserId missing" });

    try {
        const cart = await Cart.findOneAndUpdate(
            { userId: userId },           
            { items: items },             
            { new: true, upsert: true }     
        );

        res.status(200).json({ success: true, items: cart.items });
    } catch (err) {
        console.error("Sync Error:", err);
        res.status(500).json({ message: "Error saving cart!" });
    }
});

module.exports = router;