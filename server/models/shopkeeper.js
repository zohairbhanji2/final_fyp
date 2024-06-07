const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const keysecret = "your-secret-key";

const ShopkeeperSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,  // Ensure email is unique
  },
  password: {
    type: String,
    required: true,
  },
  cnic: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: false,
  },
  shoplocation: {
    type: String,
    required: false,
  },
  shopname: {
    type: String,
    required: false,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  verifytoken: {
    type: String,
  },
});

ShopkeeperSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

ShopkeeperSchema.methods.generateAuthToken = async function () {
  try {
    let token23 = jwt.sign({ _id: this._id }, keysecret, {
      expiresIn: "1d",
    });

    this.tokens = this.tokens.concat({ token: token23 });
    await this.save();
    return token23;
  } catch (error) {
    throw new Error(error);
  }
};

// Static method to fetch email based on shopkeeper name or email
ShopkeeperSchema.statics.getEmailFromShopName = async function (shopName) {
  try {
    const shopkeeper = await this.findOne({ email: shopName });
    return shopkeeper ? shopkeeper.email : null;
  } catch (error) {
    throw new Error(error);
  }
};

const Shopkeeper = mongoose.model("Shopkeeper", ShopkeeperSchema);

module.exports = Shopkeeper;
