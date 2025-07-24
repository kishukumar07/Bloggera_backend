import mongoose from "mongoose";

const contactMsgSchema = new mongoose.Schema({
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
    trim: true,
  },
});

export const contactMsgModel = mongoose.model("ContactMsg", contactMsgSchema);
