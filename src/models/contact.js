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

    //status purpose
    status: {
      type:String,
      enum: ["new", "in progress", "resolved"],
      default: "new",
    },
  },

  {
    versionKey: false,
    timestamps: true,
  }
);

export const contactMsgModel = mongoose.model("ContactMsg", contactMsgSchema);
