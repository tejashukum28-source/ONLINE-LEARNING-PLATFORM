const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  notes: { type: String, default: "" },
});

const quizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    lessons: [lessonSchema],
    quizzes: [quizSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
