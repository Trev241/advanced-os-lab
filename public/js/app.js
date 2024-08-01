// public/js/app.js

document.addEventListener("DOMContentLoaded", () => {
  const studentForm = document.getElementById("studentForm");
  const studentList = document.getElementById("studentList");

  // Fetch and display students when the page loads
  fetchStudents();

  // Add event listener to the form
  studentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form data
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const course = document.getElementById("course").value;
    const email = document.getElementById("email").value;

    // Create a new student object
    const student = { name, age, course, email };

    try {
      // Send a POST request to add a new student
      const response = await fetch("/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      });

      // If the response is successful, clear the form and fetch students again
      if (response.ok) {
        studentForm.reset();
        fetchStudents();
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.error("Error adding student:", error);
    }
  });

  // Function to fetch and display students
  async function fetchStudents() {
    try {
      // Send a GET request to fetch all students
      const response = await fetch("/students");
      const students = await response.json();

      // Clear the student list
      studentList.innerHTML = "";

      // Add each student as a card to the list
      students.forEach((student) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <h2>${student.name}</h2>
            <p><strong>Age:</strong> ${student.age}</p>
            <p><strong>Course:</strong> ${student.course}</p>
            <p><strong>Email:</strong> ${student.email}</p>
            <button class="delete-button" data-id="${student._id}">Delete</button>
          `;
        studentList.appendChild(card);
      });

      // Add event listeners to the delete buttons
      const deleteButtons = studentList.querySelectorAll(".delete-button");
      deleteButtons.forEach((button) => {
        button.addEventListener("click", async () => {
          const studentId = button.getAttribute("data-id");
          await deleteStudent(studentId);
        });
      });
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }

  // Function to delete a student
  async function deleteStudent(studentId) {
    try {
      // Send a DELETE request to remove the student
      const response = await fetch(`/students/${studentId}`, {
        method: "DELETE",
      });

      // If the response is successful, fetch students again
      if (response.ok) {
        fetchStudents();
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  }
});
