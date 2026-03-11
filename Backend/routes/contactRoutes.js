const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// POST route to save user messages
router.post("/send", async (req, res) => {
    try {
        const { name, phone, email, message } = req.body;

        // Create a new contact message object
        const newMessage = new Contact({
            name,
            phone,
            email,
            message
        });

        // Save to the database
        await newMessage.save();

        res.status(201).json({ 
            success: true, 
            message: "Your message has been sent successfully!" 
        });
    } catch (err) {
        console.error("Contact Route Error:", err);
        res.status(500).json({ 
            success: false, 
            error: "An error occurred while sending the message. Please try again." 
        });
    }
});

// GET route to fetch all messages for Admin (Optional)
router.get("/all", async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: "Error occurred while fetching messages!" });
    }
});

module.exports = router;