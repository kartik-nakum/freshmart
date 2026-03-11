const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }, 
    items: [
            {
                _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                id: { type: String }, 
                name: { type: String, required: true },
                price: { type: Number, required: true },
                qty: { type: Number, required: true, default: 1 },
                img: { type: String },
                stock: { type: Number },
                weight: { type: String }
            }
          ]
}, 
               { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);