document.addEventListener("DOMContentLoaded", () => {
    const studentForm = document.getElementById("studentForm");
    const studentTable = document.getElementById("studentTableBody");

    function clearTable(table) {
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
    }   

    async function fetchStudents() {
        try {
            const response = await fetch("../backend/server.php");
            if (!response.ok) throw new Error("Error al obtener datos");
            const students = await response.json();
            renderTable(students);
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    }

    function renderTable(students) {
        //studentTable.innerHTML = ""; // Limpia las filas actuales
        clearTable(studentTable);
        students.forEach(student => {
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = student.fullname;

            const emailCell = document.createElement("td");
            emailCell.textContent = student.email;

            const ageCell = document.createElement("td");
            ageCell.textContent = student.age;

            const actionsCell = document.createElement("td");

            const editBtn = document.createElement("button");
            editBtn.textContent = "Editar";
            editBtn.onclick = () => populateForm(student);

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Borrar";
            deleteBtn.onclick = () => deleteStudent(student.id);

            actionsCell.append(editBtn, deleteBtn);
            row.append(nameCell, emailCell, ageCell, actionsCell);
            studentTable.appendChild(row);
        });
    }

    async function deleteStudent(id) {
        try {
            const response = await fetch("../backend/server.php", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            await fetchStudents();
        } catch (error) {
            console.error("Delete error:", error);
        }
    }

    function populateForm(student) {
        studentForm.fullname.value = student.fullname;
        studentForm.email.value = student.email;
        studentForm.age.value = student.age;
        studentForm.dataset.id = student.id;
    }

    studentForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = {
            fullname: studentForm.fullname.value,
            email: studentForm.email.value,
            age: parseInt(studentForm.age.value),
        };

        const method = studentForm.dataset.id ? "PUT" : "POST";
        if (studentForm.dataset.id) {
            formData.id = parseInt(studentForm.dataset.id);
        }

        try {
            await fetch("../backend/server.php", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            studentForm.reset();
            delete studentForm.dataset.id;
            await fetchStudents();
        } catch (error) {
            console.error("Save error:", error);
        }
    });

    fetchStudents();
});
