const API = "http://localhost:5000/api";

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

function getToken() {
  return localStorage.getItem("token");
}

async function loadCourses() {
  const res = await fetch(`${API}/courses`);
  const courses = await res.json();

  const list = document.getElementById("courseList");
  list.innerHTML = "";

  courses.forEach((c) => {
    const div = document.createElement("div");
    div.className = "courseCard";
    div.innerHTML = `
      <img src="${c.thumbnail}" />
      <h3>${c.title}</h3>
      <p style="opacity:0.8;margin-top:6px;">${c.description}</p>
    `;
    div.onclick = () => {
      localStorage.setItem("courseId", c._id);
      window.location.href = "course.html";
    };
    list.appendChild(div);
  });
}

async function seedDemo() {
  await fetch(`${API}/courses/seed/demo`, { method: "POST" });
  alert("Demo course added!");
  loadCourses();
}

if (!getToken()) {
  window.location.href = "index.html";
}

loadCourses();
