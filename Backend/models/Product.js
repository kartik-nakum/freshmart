const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
        name: { type: String, required: true },
        weight: { type: String,required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        oldPrice: { type: Number },
        img: { type: String, required: true},
        qty: { type: Number, default: 1 },
        stock: { type: Number, required: true },
     }, 
       { timestamps: true });

module.exports = mongoose.model("Product", productSchema);