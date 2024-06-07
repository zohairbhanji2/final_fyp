const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const RegisterDoctorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  licensenumber: {
    type: String,
    required: true,
  },
  Phonenumber: {
    type: String,
    required: false,
  },
  username: {
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

RegisterDoctorSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

RegisterDoctorSchema.methods.generateAuthToken = async function () {
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

const RegisterDoctor = mongoose.model('RegisterDoctor', RegisterDoctorSchema);

module.exports = RegisterDoctor;
