const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");


router.get("/:userId", async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.params.userId }).populate("products");
        
        if (!wishlist) return res.json([]);
        
        const validProducts = wishlist.products.filter(p => p !== null);
        res.json(validProducts);
    } catch (err) {
        res.status(500).json({ message: "Error fetching wishlist" });
    }
});

router.post("/toggle", async (req, res) => {
    const { userId, productId } = req.body;
    try {
        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = new Wishlist({ userId, products: [productId] });
        } else {
           
            const productIndex = wishlist.products.findIndex(p => p.toString() === productId);
            
            if (productIndex === -1) {
                wishlist.products.push(productId); 
            } else {
                wishlist.products.splice(productIndex, 1); 
            }
        }
        await wishlist.save();
        res.status(200).json({ success: true, message: "Wishlist updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating wishlist" });
    }
});

module.exports = router;