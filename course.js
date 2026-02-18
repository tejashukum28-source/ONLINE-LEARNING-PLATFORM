const API = "http://localhost:5000/api";

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

function goBack() {
  window.location.href = "dashboard.html";
}

function getToken() {
  return localStorage.getItem("token");
}

const courseId = localStorage.getItem("courseId");

async function fetchCourse() {
  const res = await fetch(`${API}/courses/${courseId}`);
  return await res.json();
}

async function fetchProgress() {
  const res = await fetch(`${API}/progress/${courseId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return await res.json();
}

async function markLessonComplete(lessonIndex) {
  await fetch(`${API}/progress/${courseId}/lesson`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ lessonIndex }),
  });
}

async function saveQuizScore(score) {
  await fetch(`${API}/progress/${courseId}/quiz`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ quizScore: score }),
  });
}

function updateProgressUI(course, progress) {
  const totalLessons = course.lessons.length;
  const completed = progress.completedLessons.length;

  const percent = totalLessons === 0 ? 0 : Math.round((completed / totalLessons) * 100);

  document.getElementById("progressFill").style.width = percent + "%";
  document.getElementById("progressText").innerText = percent + "% Completed";
}

async function renderCourse() {
  if (!getToken()) return (window.location.href = "index.html");

  const course = await fetchCourse();
  let progress = await fetchProgress();

  document.getElementById("courseTitle").innerText = course.title;

  const lessonList = document.getElementById("lessonList");
  lessonList.innerHTML = "";

  course.lessons.forEach((lesson, index) => {
    const btn = document.createElement("button");
    btn.className = "lessonBtn";

    if (progress.completedLessons.includes(index)) {
      btn.classList.add("completed");
      btn.innerText = "✅ " + lesson.title;
    } else {
      btn.innerText = "▶ " + lesson.title;
    }

    btn.onclick = async () => {
      document.getElementById("videoFrame").src = lesson.videoUrl;
      document.getElementById("notesText").innerText = lesson.notes;

      await markLessonComplete(index);
      progress = await fetchProgress();
      renderCourse();
    };

    lessonList.appendChild(btn);
  });

  // Default first lesson
  if (course.lessons.length > 0) {
    document.getElementById("videoFrame").src = course.lessons[0].videoUrl;
    document.getElementById("notesText").innerText = course.lessons[0].notes;
  }

  // Quiz
  const quizBox = document.getElementById("quizBox");
  quizBox.innerHTML = "";

  let score = 0;

  course.quizzes.forEach((q, qi) => {
    const qDiv = document.createElement("div");
    qDiv.style.marginBottom = "14px";
    qDiv.innerHTML = `<p style="font-weight:bold;">${qi + 1}. ${q.question}</p>`;

    q.options.forEach((opt, oi) => {
      const optBtn = document.createElement("button");
      optBtn.className = "lessonBtn";
      optBtn.innerText = opt;

      optBtn.onclick = () => {
        if (oi === q.correctIndex) score++;
        optBtn.style.background = "#2ecc71";
        optBtn.disabled = true;
      };

      qDiv.appendChild(optBtn);
    });

    quizBox.appendChild(qDiv);
  });

  const submitBtn = document.createElement("button");
  submitBtn.innerText = "Submit Quiz";
  submitBtn.onclick = async () => {
    alert(`Your Score: ${score}/${course.quizzes.length}`);
    await saveQuizScore(score);
  };
  quizBox.appendChild(submitBtn);

  updateProgressUI(course, progress);
}

renderCourse();
