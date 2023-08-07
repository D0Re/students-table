let arrayObjectsStudents = [];

function createRow() {
  const container = document.getElementById('tbody');
  const row = document.createElement('tr');
  const td1 = document.createElement('td');
  const td2 = document.createElement('td');
  const td3 = document.createElement('td');
  const td4 = document.createElement('td');
  const td5 = document.createElement('td');
  const td6 = document.createElement('td');
  const td7 = document.createElement('td');

  row.append(td1);
  row.append(td2);
  row.append(td3);
  row.append(td4);
  row.append(td5);
  row.append(td6);
  row.append(td7);

  container.append(row);
  return { row, td1, td2, td3, td4, td5, td6, td7 };
}

async function getStudents() {
  try {
    const response = await fetch('http://localhost:3000/api/students');
    const data = await response.json();
    arrayObjectsStudents = data;
    createStudent(arrayObjectsStudents);
    localStorage.setItem('newArray', JSON.stringify(arrayObjectsStudents));
  } catch (error) {
    console.error('Ошибка при получении списка студентов:', error);
  }
}


async function saveStudent(student) {
  try {
    const response = await fetch('http://localhost:3000/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    });
    const data = await response.json();
    arrayObjectsStudents.push(data);
    createStudent(arrayObjectsStudents);
    localStorage.setItem('newArray', JSON.stringify(arrayObjectsStudents));
  } catch (error) {
    console.error('Ошибка при сохранении студента:', error);
  }
}


async function deleteStudent(rowIndex) {
  const studentId = arrayObjectsStudents[rowIndex].id;
  try {
    await fetch(`http://localhost:3000/api/students/${studentId}`, {
      method: 'DELETE',
    });
    arrayObjectsStudents.splice(rowIndex, 1);
    createStudent(arrayObjectsStudents);
    localStorage.setItem('newArray', JSON.stringify(arrayObjectsStudents));
  } catch (error) {
    console.error('Ошибка при удалении студента:', error);
  }
}

async function checkServerData() {
  try {
    const response = await fetch('http://localhost:3000/api/students');
    const data = await response.json();
    if (data.length > 0) {
      arrayObjectsStudents = data;
      createStudent(arrayObjectsStudents);
    }
  } catch (error) {
    console.error('Ошибка при проверке данных на сервере:', error);
  }
}

checkServerData();

if (localStorage.getItem('newArray') !== null && localStorage.getItem('newArray') !== '') {
  arrayObjectsStudents = JSON.parse(localStorage.getItem('newArray'), function (key, value) {
    if (key === 'birthday') return new Date(value);
    return value;
  }) || [];
  createStudent(arrayObjectsStudents);
} else {
  getStudents();
}

function createStudent(array) {
  document.getElementById('tbody').innerHTML = '';
  for (let i = 0; i < array.length; i++) {
    const now = new Date();
    const addRow = createRow();
    const finishEducation = Number(array[i].studyStart) + Number(4);
    const course = now.getFullYear() - Number(array[i].studyStart);
    let date = '';
    let month = '';
    if (!isNaN(Date.parse(array[i].birthday))) {
      const birthday = new Date(array[i].birthday);
      const date = birthday.getDate();
      const month = birthday.getMonth() + 1;
      const year = birthday.getFullYear();
      const born = new Date(year, month - 1, date);
      const getAge = Math.floor((now.getTime() - born.getTime()) / 1000 / 60 / 60 / 24 / 365.25);
      addRow.td5.innerHTML = date + '.' + month + '.' + year + ' ( ' + getAge + ' лет ) ';
    }

    addRow.td1.innerHTML = array[i].surname;
    addRow.td2.innerHTML = array[i].name;
    addRow.td3.innerHTML = array[i].lastname;
    addRow.td4.innerHTML = array[i].faculty;
    addRow.td6.innerHTML = Number(array[i].studyStart) + ' - ' + finishEducation + ' ( ' + course + ' курс ) ';

    if (course >= 5) {
      addRow.td6.innerHTML = 'закончил';
    }
    array[i].finishEducation = finishEducation;

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Удалить';
    deleteButton.addEventListener('click', async function () {
      const rowIndex = Array.from(this.parentNode.parentNode.parentNode.children).indexOf(this.parentNode.parentNode);
      await deleteStudent(rowIndex);
    });


    addRow.td7.appendChild(deleteButton);


  }
  return array;
}

createStudent(arrayObjectsStudents);


let newArray = arrayObjectsStudents.slice();
document.querySelector('.table-dark__th-button-name').addEventListener('click', function () {
  const result = newArray.sort((a, b) => (a.surname > b.surname ? 1 : -1));
  createStudent(result);
});

document.querySelector('.table-dark__th-button-faculty').addEventListener('click', function () {
  const result = newArray.sort((a, b) => (a.faculty > b.faculty ? 1 : -1));
  createStudent(result);
});

document.querySelector('.table-dark__th-button-birth').addEventListener('click', function () {
  const result = newArray.sort((a, b) => (a.birthday > b.birthday ? 1 : -1));
  createStudent(result);
});
document.querySelector('.table-dark__th-button-education').addEventListener('click', function () {
  const result = newArray.sort((a, b) =>
    (a.studyStart < b.studyStart ? 1 : -1));
  createStudent(result);
});

const form = document.querySelector('.form-add');
const fields = form.querySelectorAll('.form-control');
const inputName = document.getElementById('input__name');
const inputSurname = document.getElementById('input__surname')
const inputlastname = document.getElementById('input__middleName')
const inputFaculty = document.getElementById('input__faculty');
const inputBirth = document.getElementById('input__age');
const inputStartEducation = document.getElementById('input__start-education');
const tableBody = document.getElementById('tbody');
const date = new Date();
let filterArrayObjectsStudents = [];
inputBirth >= 1900;
function showError(message) {
  const error = document.createElement('div');
  error.classList.add('error');
  error.style.color = 'red';
  error.innerHTML = message;
  return error;
}

function removeError() {
  const errors = form.querySelectorAll('.error');
  for (let i = 0; i < errors.length; i++) {
    errors[i].remove();
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  removeError();
  const birthYear = new Date(inputBirth.value).getFullYear();
  if (birthYear < 1900) {
    const error = showError('Год рождения должен быть не ранее 1900 года');
    inputBirth.parentElement.insertBefore(error, inputBirth);
    return;
  }
  function getAgeInForm(birthDate) {
    const now = new Date();
    const born = new Date(
      birthDate.getFullYear(),
      birthDate.getMonth() + 1,
      birthDate.getDate(),
    );
    const diffInMilliseconds = now.getTime() - born.getTime();
    return Math.floor(diffInMilliseconds / 1000 / 60 / 60 / 24 / 365.25);
  }

  function formatDateInForm(dateInForm) {
    let d = dateInForm.getDate();
    if (d < 10) d = '0' + d;
    let m = dateInForm.getMonth() + 1;
    if (m < 10) m = '0' + m;
    const y = dateInForm.getFullYear();

    return d + '.' + m + '.' + y;
  }

  for (let i = 0; i < fields.length; i++) {
    if (!fields[i].value.trim() || fields[i].value.length < 3) {
      const error = showError('Поле нужно обязательно заполнить!');
      fields[i].parentElement.insertBefore(error, fields[i]);
      return;
    }
  }

  if (inputBirth.valueAsDate > date) {
    const error = showError('Введите корректную дату не раньше 1900 года!');
    inputBirth.parentElement.insertBefore(error, inputBirth);
    return;
  }
  if (inputStartEducation.value !== '' && inputStartEducation.value < 2000 || inputStartEducation.value > date.getFullYear()) {
    const error = showError('Не ранее 2000г, не позднее текущего года!');
    inputStartEducation.parentElement.insertBefore(error, inputStartEducation);
    return;
  }

  const addRow = createRow();
  addRow.td1.innerHTML = inputSurname.value,
    addRow.td2.innerHTML = inputName.value;
  addRow.td3.innerHTML = inputlastname.value,
    addRow.td4.innerHTML = inputFaculty.value;
  addRow.td5.innerHTML = formatDateInForm(new Date(inputBirth.value)) + ' ( ' + getAgeInForm(new Date(inputBirth.value)) + ' лет ) ';
  const finishEducation = Number(inputStartEducation.value) + Number(4);
  const course = date.getFullYear() - Number(inputStartEducation.value) + ' курс ';
  addRow.td6.innerHTML = inputStartEducation.value + ' - ' + finishEducation + ' ( ' + course + ' ) ';
  if (finishEducation < date.getFullYear()) {
    addRow.td6.innerHTML = 'закончил';
  }


  const studentObject = {};

  studentObject.surname = inputSurname.value,
    studentObject.name = inputName.value,
    studentObject.lastname = inputlastname.value,
    studentObject.birthday = new Date(inputBirth.value);
  studentObject.studyStart = inputStartEducation.value;
  studentObject.finishEducation = finishEducation;
  studentObject.faculty = inputFaculty.value;

  newArray.push(studentObject);
  filterArrayObjectsStudents.push(studentObject);
  localStorage.setItem('newArray', JSON.stringify(arrayObjectsStudents));

  inputSurname.value = '',
    inputName.value = '';
  inputlastname.value = '';
  inputFaculty.value = '';
  inputBirth.value = '';
  inputStartEducation.value = '';

  localStorage.setItem('newArray', JSON.stringify(arrayObjectsStudents));
  createStudent(arrayObjectsStudents);

  await saveStudent(studentObject)
  form.reset();
});


const inputSearchName = document.getElementById('search-name');
const inputSearchFaculty = document.getElementById('search-faculty');
const inputSearchStartEducation = document.getElementById('search-start-education');
const inputSearchFinishEducation = document.getElementById('search-finish-education');
let timeoutId = null;
filterArrayObjectsStudents = arrayObjectsStudents.slice();

function filterFullNameToSubstr(str, object) {
  const fullName = (`${object.surname}${object.name}${object.lastname}`).toLowerCase();
  return fullName.includes(str);
}

function filterFacultyToSubstr(str, object) {
  const faculty = (`${object.faculty}`).toLowerCase();
  return faculty.includes(str);
}

function filterStartEducation(str, object) {
  const startEducation = ((`${object.studyStart}`));
  return startEducation.includes(str);
}

function filterFinishEducation(str, object) {
  const finishEducation = ((`${object.studyStart + Number(4)}`));
  return finishEducation.includes(str);
}

const inputsSearch = document.querySelectorAll('.form-control-input');
for (let i = 0; i < inputsSearch.length; i++) {
  inputsSearch[i].oninput = function () {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const substrName = inputSearchName.value.toLowerCase();
      const substrFaculty = inputSearchFaculty.value.toLowerCase();
      const substrStartEducation = inputSearchStartEducation.value.toLowerCase();
      const substrFinishEducation = inputSearchFinishEducation.value.toLowerCase();
      let result = filterArrayObjectsStudents.filter(student =>
        filterFullNameToSubstr(substrName, student));
      if (substrFaculty !== '') {
        result = result.filter(student =>
          filterFacultyToSubstr(substrFaculty, student));
      }
      if (substrStartEducation !== '') {
        result = result.filter(student =>
          filterStartEducation(substrStartEducation, student));
      }
      if (substrFinishEducation !== '') {
        result = result.filter(student =>
          filterFinishEducation(substrFinishEducation, student));
      }
      createStudent(result);
    }, 300);
  };

}
