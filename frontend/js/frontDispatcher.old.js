// frontend/js/frontDispatcher.js
const API_URL = '../backend/server.php';

document.addEventListener('DOMContentLoaded', () => {
  fetchStudents();

  const form = document.getElementById('studentForm');
  form.addEventListener('submit', handleFormSubmit);
});

async function fetchStudents() {
  try {
    const response = await fetch(API_URL);
    const students = await response.json();
    renderStudents(students);
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
  }
}

function renderStudents(students) {
  const tbody = document.getElementById('studentTableBody');
  tbody.innerHTML = ''; // Limpiar tabla

  students.forEach(student => {
    const tr = document.createElement('tr');

    const nameTd = document.createElement('td');
    nameTd.textContent = student.fullname;

    const emailTd = document.createElement('td');
    emailTd.textContent = student.email;

    const ageTd = document.createElement('td');
    ageTd.textContent = student.age;

    const actionsTd = document.createElement('td');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'w3-button w3-blue w3-small';
    editBtn.onclick = () => populateForm(student);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'w3-button w3-red w3-small w3-margin-left';
    deleteBtn.onclick = () => deleteStudent(student.id);

    actionsTd.appendChild(editBtn);
    actionsTd.appendChild(deleteBtn);

    tr.appendChild(nameTd);
    tr.appendChild(emailTd);
    tr.appendChild(ageTd);
    tr.appendChild(actionsTd);

    tbody.appendChild(tr);
  });
}

function populateForm(student) {
  document.getElementById('studentId').value = student.id;
  document.getElementById('fullname').value = student.fullname;
  document.getElementById('email').value = student.email;
  document.getElementById('age').value = student.age;
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('studentId').value;
  const fullname = document.getElementById('fullname').value;
  const email = document.getElementById('email').value;
  const age = document.getElementById('age').value;

  const student = { id, fullname, email, age };

  try {
    const method = id ? 'PUT' : 'POST';
    const response = await fetch(API_URL, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(student)
    });

    if (response.ok) {
      document.getElementById('studentForm').reset();
      document.getElementById('studentId').value = '';
      fetchStudents();
    } else {
      console.error('Error al guardar');
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
}

async function deleteStudent(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar este estudiante?')) return;

  try {
    const response = await fetch(API_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    });

    if (response.ok) {
      fetchStudents();
    } else {
      console.error('Error al eliminar');
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
}
