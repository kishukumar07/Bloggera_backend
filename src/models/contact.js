import mongoose from "mongoose";

const contactMsgSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const contactMsgModel = mongoose.model("ContactMsg", contactMsgSchema);
