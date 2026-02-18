const express = require("express");
const Progress = require("../models/Progress");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get progress
router.get("/:courseId", protect, async (req, res) => {
  const progress = await Progress.findOne({
    userId: req.user.id,
    courseId: req.params.courseId,
  });

  res.json(progress || { completedLessons: [], quizScore: 0 });
});

// Mark lesson complete
router.post("/:courseId/lesson", protect, async (req, res) => {
  const { lessonIndex } = req.body;

  let progress = await Progress.findOne({
    userId: req.user.id,
    courseId: req.params.courseId,
  });

  if (!progress) {
    progress = await Progress.create({
      userId: req.user.id,
      courseId: req.params.courseId,
      completedLessons: [],
      quizScore: 0,
    });
  }

  if (!progress.completedLessons.includes(lessonIndex)) {
    progress.completedLessons.push(lessonIndex);
  }

  await progress.save();
  res.json(progress);
});

// Save quiz score
router.post("/:courseId/quiz", protect, async (req, res) => {
  const { quizScore } = req.body;

  let progress = await Progress.findOne({
    userId: req.user.id,
    courseId: req.params.courseId,
  });

  if (!progress) {
    progress = await Progress.create({
      userId: req.user.id,
      courseId: req.params.courseId,
      completedLessons: [],
      quizScore: 0,
    });
  }

  progress.quizScore = quizScore;
  await progress.save();

  res.json(progress);
});

module.exports = router;
