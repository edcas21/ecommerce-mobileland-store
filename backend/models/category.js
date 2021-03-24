const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: String,
  icon: String,
});

// virtual id to get rid of the need to specify _id like it gets stored in db
categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

categorySchema.set("toJSON", {
  virtuals: true,
});

exports.Category = mongoose.model("Category", categorySchema);
