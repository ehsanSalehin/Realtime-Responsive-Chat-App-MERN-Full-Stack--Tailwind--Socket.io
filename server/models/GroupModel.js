import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Messages" }],
}, { timestamps: true });

const Group = mongoose.model("Group", groupSchema);

export default Group;
