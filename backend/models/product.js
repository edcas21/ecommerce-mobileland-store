mongoose = require("mongoose");

// Product table schema
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  richDescription: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  images: [String],
  brand: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 500,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

// virtual id to get rid of the need to specify _id like it gets stored in db
productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

productSchema.set('toJSON', {
  virtuals: true
});

exports.Product = mongoose.model("Product", productSchema);
