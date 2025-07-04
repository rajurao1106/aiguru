import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema({
  name: String,
});

const ChapterSchema = new mongoose.Schema({
  name: String,
  topics: [TopicSchema],
});

export default mongoose.models.Chapter || mongoose.model("Chapter", ChapterSchema);
