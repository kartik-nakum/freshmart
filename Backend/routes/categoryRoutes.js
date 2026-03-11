const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Product = require("../models/Product"); 

// 1. Get all categories
router.get("/", async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ error: "Error fetching category!" });
    }
});

// 2. Add new category 
router.post("/add", async (req, res) => {
    try {
        const { name, img } = req.body;
        const newCategory = new Category({ name, img });
        await newCategory.save();
        res.status(201).json({ message: "Category added successfully!", category: newCategory });
    } catch (err) {
        res.status(400).json({ error: "This category already exists or the data is invalid!" });
    }
});


//3. update category
router.put("/update/:id", async (req, res) => {
    try {
        const oldCategory = await Category.findById(req.params.id);
        if (!oldCategory) {
            return res.status(404).json({ error: "Category not found!" });
        }

        const oldName = oldCategory.name;
        const newName = req.body.name;

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (oldName !== newName) {
            await Product.updateMany(
                { category: oldName }, 
                { $set: { category: newName } }
            );
        }

        res.status(200).json({ 
            success: true, 
            message: "Category and all related products updated successfully!", 
            category: updatedCategory 
        });
        
    } catch (err) {
        console.error("Update Error:", err);
        res.status(400).json({ error: "Error occurred while updating!" });
    }
});

// 4. Delete category (DELETE)
router.delete("/:id", async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Category deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Error occurred while deleting!" });
    }
});

module.exports = router;