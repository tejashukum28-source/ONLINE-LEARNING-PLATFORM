const express = require("express");
const Course = require("../models/Course");

const router = express.Router();

// Get all courses
router.get("/", async (req, res) => {
  const courses = await Course.find().sort({ createdAt: -1 });
  res.json(courses);
});

// Get single course
router.get("/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json(course);
});

// Seed demo course
router.post("/seed/demo", async (req, res) => {
  await Course.deleteMany();

  const course = await Course.create({
    title: "Full Stack Web Development",
    description: "Learn HTML, CSS, JS, Node, MongoDB with videos + quizzes.",
    thumbnail: "https://picsum.photos/600/400",
    lessons: [
      {
        title: "Introduction to HTML",
        videoUrl: "https://www.youtube.com/embed/pQN-pnXPaVg",
        notes: "HTML is the structure of a website.",
      },
      {
        title: "CSS Basics",
        videoUrl: "https://www.youtube.com/embed/OEV8gMkCHXQ",
        notes: "CSS makes your website beautiful.",
      },
      {
        title: "JavaScript Basics",
        videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk",
        notes: "JavaScript adds logic & interactivity.",
      },
    ],
    quizzes: [
      {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Transfer Markup Link"],
        correctIndex: 0,
      },
      {
        question: "CSS is used for?",
        options: ["Logic", "Styling", "Database"],
        correctIndex: 1,
      },
    ],
  });

  res.json({ message: "Demo course created", course });
});

module.exports = router;
