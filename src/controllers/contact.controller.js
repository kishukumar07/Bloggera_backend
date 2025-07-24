import { contactMsgModel } from "../models/contact.js";


export const sendMsg = async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid request body" });
    }

    const { message, email, name } = req.body;

    if (!message || !email || !name) {
      return res
        .status(400)
        .json({ success: false, msg: "Please enter all the fields" });
    }

    const savedMsg = await contactMsgModel.create({ message, email, name });

    res.status(200).json({
      success: true,
      msg: "Message sent successfully!",
      data: savedMsg,
    });
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({
      success: false,
      msg: "Something went wrong. Please try again later.",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const messages = await contactMsgModel.find().sort({ createdAt: -1 }); // Latest first

    res.status(200).json({
      success: true,
      msg: "All messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({
      success: false,
      msg: "Failed to fetch messages. Please try again later.",
    });
  }
};
