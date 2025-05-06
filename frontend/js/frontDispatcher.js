// frontend/js/frontDispatcher.js

const API_URL = '../backend/server.php';

document.addEventListener('DOMContentLoaded', () => {
  loadStudents();
  setupFormHandler();
});

// === API ===
const studentAPI = {
  async fetchAll() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("No se pudieron obtener los estudiantes");
    return await res.json();
  },

  async create(student) {
    return await sendJSON('POST', student);
  },

  async update(student) {
    return await sendJSON('PUT', student);
  },

  async remove(id) {
    return await sendJSON('DELETE', { id });
  }
};

async function sendJSON(method, data) {
  const res = await fetch(API_URL, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Error en ${method}`);
  return await res.json();
}

// === UI ===
function setupFormHandler() {
  const form = document.getElementById('studentForm');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const student = getFormData();

    try {
      if (student.id) {
        await studentAPI.update(student);
      } else {
        await studentAPI.create(student);
      }
      clearForm();
      loadStudents();
    } catch (err) {
      console.error(err.message);
    }
  });
}

function getFormData() {
  return {
    id: document.getElementById('studentId').value.trim(),
    fullname: document.getElementById('fullname').value.trim(),
    email: document.getElementById('email').value.trim(),
    age: parseInt(document.getElementById('age').value.trim(), 10)
  };
}

function clearForm() {
  document.getElementById('studentForm').reset();
  document.getElementById('studentId').value = '';
}

async function loadStudents() {
  try {
    const students = await studentAPI.fetchAll();
    renderStudentTable(students);
  } catch (err) {
    console.error('Error cargando estudiantes:', err.message);
  }
}

function renderStudentTable(students) {
  const tbody = document.getElementById('studentTableBody');
  tbody.replaceChildren(); // limpia seguro

  students.forEach(student => {
    const tr = document.createElement('tr');

    tr.appendChild(createCell(student.fullname));
    tr.appendChild(createCell(student.email));
    tr.appendChild(createCell(student.age.toString()));
    tr.appendChild(createActionsCell(student));

    tbody.appendChild(tr);
  });
}

function createCell(text) {
  const td = document.createElement('td');
  td.textContent = text;
  return td;
}

function createActionsCell(student) {
  const td = document.createElement('td');

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Editar';
  editBtn.className = 'w3-button w3-blue w3-small';
  editBtn.addEventListener('click', () => fillForm(student));

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Borrar';
  deleteBtn.className = 'w3-button w3-red w3-small w3-margin-left';
  deleteBtn.addEventListener('click', () => confirmDelete(student.id));

  td.appendChild(editBtn);
  td.appendChild(deleteBtn);
  return td;
}

function fillForm(student) {
  document.getElementById('studentId').value = student.id;
  document.getElementById('fullname').value = student.fullname;
  document.getElementById('email').value = student.email;
  document.getElementById('age').value = student.age;
}

async function confirmDelete(id) {
  if (!confirm('¿Estás seguro que deseas borrar este estudiante?')) return;

  try {
    await studentAPI.remove(id);
    loadStudents();
  } catch (err) {
    console.error('Error al borrar:', err.message);
  }
}
