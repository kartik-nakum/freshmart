const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");

// Route to place a new order
router.post("/place", async (req, res) => {
    const { cartItems, customerDetails, totalAmount } = req.body;

    try {
        const newOrder = new Order({
            orderId: "ORD" + Math.floor(Math.random() * 1000000),
            userEmail: customerDetails.email,
            customerDetails: customerDetails,
            items: cartItems.map(item => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                qty: item.qty,
                img: item.img
            })),
            totalAmount: totalAmount
        });

        const savedOrder = await newOrder.save();

        // Update product stock after order is placed
        for (const item of cartItems) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.stock = Math.max(0, product.stock - item.qty);
                await product.save();
            }
        }

        res.status(201).json({ 
            success: true, 
            orderId: savedOrder.orderId 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// 1. Get all orders
router.get("/all-orders", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching orders" });
    }
});

//  Update order status
router.put("/update-status/:id", async (req, res) => {
    try {
        const mongoId = req.params.id;
        const { status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            mongoId,
            { status: status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found!" });
        }

        res.status(200).json({
            success: true,
            message: `Order status updated to ${status} successfully.`,
            order: updatedOrder
        });
    } catch (err) {
        console.error("Status Update Error:", err);
        res.status(500).json({ success: false, message: "Server Error!" });
    }
});

// Get orders for a specific user by email
router.get("/my-orders/:email", async (req, res) => {
    try {
        let userEmail = req.params.email;
        
        userEmail = userEmail.replace(/^["'](.+)["']$/, '$1');

        const orders = await Order.find({ userEmail: userEmail }).sort({ createdAt: -1 });
        
        res.status(200).json(orders);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Error fetching orders!" });
    }
});

module.exports = router;