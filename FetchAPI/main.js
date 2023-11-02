var couseApi = 'http://localhost:3000/courses'

function start() {
    getCourses(renderCourse);

    handleCreateForm()
}

start();

function getCourses(callback) {
    fetch(couseApi)
    .then((response) =>{
        return response.json();
    })
    .then(callback)
}

function renderCourse(courses) {
    var listCourse = document.querySelector('#list-courses');

    var htmls = courses.map((course) => {
        return `
            <li class="course-item-${course.id}">
                <h4>${course.name}</h4>
                <p>${course.description}</p>
                <button onclick="handleDeleteCourse(${course.id})">Xoa</button>
                <button onclick="handleUpdateCourse(${course.id})">Cap Nhat</button>
            </li>
        `;
    });

    listCourse.innerHTML = htmls.join('');
}

function createCourse(data) {
    var options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify(data)
    }

    fetch(couseApi, options)
        .then((response) =>{
            response.json();
        })
        .then(callback);
}

function handleDeleteCourse(id) {
    var options = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        }
    }

    fetch(couseApi + '/' + id , options)
        .then((response) =>{
            response.json();
        })
        .then(() => {
            var courseItem = document.querySelector('.course-item-'+id);
            if(courseItem){
                courseItem.remove();
            }
        });
}



function handleCreateForm() {
    var createBtn = document.querySelector('#create');
    createBtn.onclick = () => {
        var name = document.querySelector('input[name="name"]').value;
        var description = document.querySelector('input[name="description"]').value;

        var formData = {
            name: name,
            description: description
        }
        createCourse(formData, function() {
            getCourses(renderCourse);
        })
    }
}

function handleUpdateCourse(id) {

    document.getElementById('create').style.display ='none'

    var saveBtn = document.getElementById('save');
    saveBtn.style.display ='block'

    var courseItem = document.querySelector('.course-item-' + id);

    var nameInput = document.querySelector('input[name="name"]');
    var descriptionInput = document.querySelector('input[name="description"]');
    
    var nameElement = courseItem.querySelector('h4');
    var descriptionElement = courseItem.querySelector('p')
    
    nameInput.value = nameElement.textContent;
    descriptionInput.value = descriptionElement.textContent;

    if (nameInput && descriptionInput) {
        saveBtn.onclick = function(e) {
            updateCourse(id);
        }
    }
}


function updateCourse(id) {
    var nameInput = document.querySelector('input[name="name"]');
    var descriptionInput = document.querySelector('input[name="description"]');
    var newData = {
        name: nameInput.value,
        description: descriptionInput.value
    };
    var options = {
        method: 'PUT', 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newData)
    }

    fetch(couseApi + '/' + id, options)
        .then((response) => {
            return response.json();
        })
        .then((updatedCourse) => {
            var courseItem = document.querySelector('.course-item-' + id);

            var nameElement = courseItem.querySelector('h4');
            var descriptionElement = courseItem.querySelector('p');

            nameElement.textContent = updatedCourse.name;
            descriptionElement.textContent = updatedCourse.description;
            
        })
        .catch(e => console.log(e));
}



