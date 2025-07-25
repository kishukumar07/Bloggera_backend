import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    city: { type: String },
    age: { type: Number },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Usermodel = mongoose.model("user", userSchema);
