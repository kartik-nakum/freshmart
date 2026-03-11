const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
        orderId: { type: String, required: true, unique: true },
        userEmail: { type: String, required: true },
        customerDetails: {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pinCode: { type: String, required: true },
        phone: { type: String, required: true },
        paymentMode: { type: String, required: true }
    },
    items: [
        {
            productId: { type: String }, 
            name: { type: String },
            price: { type: Number },
            qty: { type: Number },
            img: { type: String }
        }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Success" }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);