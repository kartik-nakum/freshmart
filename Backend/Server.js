require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const authRoutes = require("./routes/authRoutes");

const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes");

const productRoutes = require("./routes/productRoutes");

const categoryRoutes = require("./routes/categoryRoutes");

const cartRoutes = require("./routes/cartRoutes");

const shopRoutes = require("./routes/shopRoutes");

const contactRoutes = require("./routes/contactRoutes");

const wishlistRoutes = require("./routes/wishlistRoutes");

const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api", authRoutes);
app.use("/api", forgotPasswordRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});