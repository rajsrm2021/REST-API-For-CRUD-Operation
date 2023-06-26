const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
mongoose
  .connect("mongodb://127.0.0.1:27017/restapi", { useNewUrlParser: true })
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
});

const Product = new mongoose.model("Product", productSchema);

// creat product

app.post("/api/v1/product/new", async (req, res) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    sucess: true,
    product,
  });
});

// read product
app.get("/api/v1/products", async (req, res) => {
  const products = await Product.find();

  res.status(200).json({
    sucess: true,
    products,
  });
});

// update product

app.put("/api/v1/product/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    res.status(500).json({
      sucess: false,
      message: "product not found in the list",
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    useFindAndModify: false,
    runValidators: true,
  });

  res.status(200).json({
    sucess: true,
    product,
  });
});

// Delete product

app.delete("/api/v1/product/:id", async (req, res) => {
  const productdelete = await Product.findById(req.params.id);
  if (!productdelete) {
    res.status(500).json({
      sucess: false,
      message: "product not found in the list",
    });
  }
  await productdelete.deleteOne({});

  res.status(200).json({
    sucess: true,
    message: "product is deleted sucessfully"
  });
});

app.listen(4500, () => {
  console.log("server is running on http://localhost:4500/");
});
