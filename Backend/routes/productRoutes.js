const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Add product
router.post("/add", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Get all products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Update product
router.put("/:id", async (req, res) => {
  try{
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({success: true,updated});
    } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || id === "undefined") {
      return res.status(400).json({ success: false, message: "Invalid Product ID" });
    }

    const deleted = await Product.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Server error during deletion" });
  }
});

module.exports = router;