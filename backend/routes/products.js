const { Product } = require("../models/product");
const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const api = process.env.API_URL;

// GET all products
router.get("/", async (req, res) => {
  // await (makes it asynchronous) instead of then for a promise
  const productList = await Product.find().populate("category");

  if (!productList) res.status.json({ success: false });

  res.send(productList);
});

// GET single product
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) res.status.json({ success: false });

  res.send(product);
});

// POST a new product
router.post("/", async (req, res) => {
  const category = await Category.findById(req.body.category);

  if (!category) return res.status(400).send("Invalid category");

  let product = new Product({
    name: req.body.name,
    brand: req.body.brand,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product = await product.save();

  if (!product) return res.status(500).send("The product cannot be created");

  res.send(product);
});

// PUT to update product
router.put("/:id", async (req, res) => {

  // Check if the product id is valid
  if(!mongoose.isValidObjectId(req.params.id)) res.status(500).json({ message: "The product with the given Id was not found" });

  const category = await Category.findById(req.body.category);

  // Check if the category id is valid
  if (!category) res.status(500).json({ message: "The category with the given Id was not found" });

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      brand: req.body.brand,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );

  if (!product) return res.status(404).send("The product cannot be updated!");

  res.send(product);
});

// Delete product by id
router.delete('/:id', (req, res) => {
  // using a promise instead of async
  Product.findByIdAndRemove(req.params.id).then(
      product => {
          if(product) return res.status(200).json({success: true, message: 'the product has been deleted'});
          // If it's not found
          return res.status(404).json({success: false, message: "the product was not found"});
      }
  ).catch( err => {
      return res.status(400).json({sucess: false, error: err});
  });
});

// Statistics GET count of products
router.get('/get/count', async (req, res) => {
  // await (makes it asynchronous) instead of then for a promise
  const productCount = await Product.countDocuments((count) => count);

  if (!productCount) res.status.json({ success: false });

  res.send({
    productCount: productCount
  });
});

// GET featured products
router.get('/get/featured/:count', async (req, res) => {

  const count = req.params.count ? req.params.count : 0;

  const featuredProducts = await Product.find({isFeatured: true}).limit(+count);

  if (!featuredProducts) res.status.json({ success: false });

  res.send(featuredProducts);
});

// GET products by category
router.get(`/`, async (req, res) => {

  let filter = {};

  if(req.query.categories) {
    filter = { category: req.query.categories.split(',') };
    console.log(filter);
  }

  const productList = await Product.find(filter).populate('category');

  if (!productList) res.status.json({ success: false });

  res.send(productList);
});

module.exports = router;
