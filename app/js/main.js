
// Load message
console.log("vanilla js");

// Selectors
var wrapper = document.querySelector('#wrapper');
var tInput = document.querySelector('#text-input');
var mainBtn = document.querySelector('#main-btn');
var listWrapper = document.querySelector('#list-wrapper');

// Array of todo objects
var listTodo = [];



// create new todo
function createTodo() {
    'use strict';
    if (tInput.value) {
        var text = tInput.value;
        var newTodo = new Todo('aColor', text, 1, false);

        // Push new Todo object and render
        listTodo.push(newTodo);
        renderTodo(listTodo[listTodo.length - 1].create(), listWrapper);

        // Clear tInput
        tInput.value = '';
    } else {
        wrapper.classList.toggle('shake');
        setTimeout(function () {
			wrapper.classList.toggle("shake");
        }, 200);
    }
}

// Dependent on listTodo array
function changeTodo(obj) {
    'use strict';
    //Get id from parent node
    var searchId = obj.parentNode.getAttribute('data-id');
    var newText = obj.value;

    // Search (filter) for todo object id
    var newArray = listTodo.filter(function (element) {
        return element.id === parseInt(searchId);
    });

    // captures id error
    if (newArray.length === 1) {
        // Change text in Todo
        newArray[0].text = newText;
        // Change check status on Todo
        newArray[0].check = /(check)/.test(obj.parentNode.className);
    } else {
        console.log('Error, object id conflict');
    }
}

// Delete todo object
function deleteTodo(obj) {
    'use strict';
    //Get id from parent node
    var deleteId = obj.parentNode.getAttribute('data-id');

    // Search (filter) for todo object id
    var newArray = listTodo.filter(function (element) {
        return element.id !== parseInt(deleteId);
    });

    // captures id error
    if (listTodo.length - newArray.length === 1) {
        listTodo = newArray;
    } else {
        console.log('Error, object id conflict');
    }
}

/*******************************/
//  ToDo Object Constructor
/*******************************/
function Todo(color, text, id, check) {
    'use strict';
    this.id = id;
    this.color = color;
    this.text = text;
    this.check = check;
    this.time = new Date();

    // Create a node of the object
    this.create = function () {
        // Wrapper div element
        var todoWrapper = document.createElement('div');
        todoWrapper.className = 'todo-wrapper';
        todoWrapper.setAttribute('data-id', this.id);

        // Check box element
        var label = document.createElement('i');
        label.className = 'label-btn material-icons';

        // input element
        var todoText = document.createElement('input');
        todoText.className = 'todo-text';
        todoText.setAttribute('type', 'text');
        todoText.setAttribute('value', this.text);
        todoText.setAttribute('readonly', 'readonly');

        // Remove element
        var remove = document.createElement('i');
        remove.className = 'remove-btn material-icons';
        remove.textContent = 'clear';

        // ------------- Add Event Listeners

        // dbclick to remove 'readonly' attribute
        todoText.addEventListener('dblclick', function () {
            this.removeAttribute('readonly');
        });
        // blur to add 'readonly' attribute
        todoText.addEventListener('blur', function () {
            this.setAttribute('readonly', 'readonly');
        });

        // Change a todo
        todoText.addEventListener('change', function () {
            changeTodo(this);
        });

        // Check todo
        label.addEventListener('click', function () {
            this.classList.toggle('x');
            this.parentNode.classList.toggle('check');
            changeTodo(this);
        });

        // Remove todo
        remove.addEventListener('click', function () {
            this.parentElement.parentElement.removeChild(this.parentElement);
            deleteTodo(this);
        });

        // If checked add css classes
        if (check) {
            label.classList.add('x');
            todoWrapper.classList.toggle('check');
        }

        // Add all nodes to the wrapper
        todoWrapper.appendChild(label);
        todoWrapper.appendChild(todoText);
        todoWrapper.appendChild(remove);

        return todoWrapper;
    };
}


// Render all Todo objects
function renderTodoAll(array, target) {
    'use strict';
    // Remove all old nodes
    while (target.firstChild) {
        target.removeChild(target.firstChild);
    }
    // Render all todo in array
    array.forEach(function (element) {
        target.appendChild(element.create());
    });
}

// Render a single Todo
function renderTodo(object, target) {
    'use strict';
    target.appendChild(object);
}

// Create todo EventListener
mainBtn.addEventListener('click', createTodo);
tInput.addEventListener("keypress", function (e) {
    'use strict';
	if (e.key === "Enter") {
	    createTodo();
	}
});












// Testing!
var a = document.querySelector('#list-wrapper');

listTodo.push(new Todo('aColor', 'get a kick-ass internship!', 1001, false));
listTodo.push(new Todo('cColor', 'fix Safari bugg', 1002, false));
listTodo.push(new Todo('bColor', 'add ID system', 1003, false));
listTodo.push(new Todo('vColor', 'cant use DB to save data', 1004, false));
listTodo.push(new Todo('vColor', 'We need animation!', 1005, false));
listTodo.push(new Todo('vColor', '', 1006, false));
listTodo.push(new Todo('vColor', 'This is way too long!... How do i solv that', 1007, false));
listTodo.push(new Todo('vColor', '<-- color labels here', 1008, false));
listTodo.push(new Todo('vColor', 'dbclick or single to change', 1009, false));

var x = new Todo('aColor', 'XXX', 1);

renderTodoAll(listTodo, listWrapper);

