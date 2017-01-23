
// Load message
console.log("ToDo, Loaded!");

// Selectors
var wrapper = document.querySelector('#wrapper');
var tInput = document.querySelector('#text-input');
var mainBtn = document.querySelector('#main-btn');
var listWrapper = document.querySelector('#list-wrapper');
var btn = document.querySelectorAll('.btn');
var btnWrapper = document.querySelector('.btn-wrapper');
var checkAllBtn = document.querySelector('#check-all');
var deleteAllBtn = document.querySelector('#delete-all');
var sortNameBtn = document.querySelector('#sort-byName');
var sortIdBtn = document.querySelector('#sort-byId');
var sortColorBtn = document.querySelector('#sort-byColor');
var filterBtn = document.querySelector('#filter-color');


// unique id counter (use id++ to asign a new id)
var id = 100;

// Array of todo objects
var todoArray = [];

function test(target) {

            btn.forEach(function(e) {
                e.addEventListener('click', function() {
                    console.log(target);
                });
            });
        }

//------------------------------/
// HELPER functions (small function to help)
//------------------------------/

// Search For Value method (added to the array prototype)
// Three arguments, property & value to search for and...
// boolean deffines if to return search matches(true) or not matches(false)
// Return new array
Array.prototype.searchForValue = function(property, value, boolean) {
    var result = this.filter(function (element) {
        if (boolean) {
            return element[property] === value;
        } else {
            return element[property] !== value;
        }
    });
    return result;
}


// Sort By Property method (added to the array prototype)
// One argument, property to sort by
// Return new array
Array.prototype.sortByProp = function(property) {
    // compare the first with the second element in the array
    var sorted = this.slice(0).sort(function(first, second) {
        if (first[property] > second[property]) {
            return 1;
        } 
        else if (first[property] < second[property]) {
            return -1;
        } else {
            return 0;
        }
    });
    // Return sorted array
    return sorted;
}





// Adds a shake effect to the wrapper elements
function shake() {
    wrapper.classList.toggle('shake');
    setTimeout(function () {
		wrapper.classList.toggle("shake");
    }, 200);
}

/*******************************/
//  CREATE Todo object from array
/*******************************/
function createTodo() {
    'use strict';
    if (tInput.value) {
        var text = tInput.value;
        var color = mainBtn.className;
        var newTodo = new Todo(color, text, id++, false);

        // Push new Todo object and render
        todoArray.push(newTodo);
        renderTodo(todoArray[todoArray.length - 1].create(), listWrapper);

        // Clear tInput
        tInput.value = '';
    } else {
        shake();
    }
}

/*******************************/
//  CHANGE ToDo object (text)
/*******************************/
function changeTodo(obj) {
    'use strict';
    //Get id from parent node
    var changeId = parseInt(obj.parentNode.getAttribute('data-id'));
    var newText = obj.value;

    // Search (filter)
    var newArray = todoArray.searchForValue('id', changeId, true);

    // Cotroll for empty todo
    if (newText) {
        // Change text in Todo
        newArray[0].text = newText;
        } else {
            // shake effect
            shake();
            // Reset value
            obj.value = newArray[0].text;
        }
}

/*******************************/
//  CHANGE ToDo object (check)
/*******************************/
function changeTodoCheck(obj) {
    'use strict';
    //Get id from parent node
    var changeId = parseInt(obj.parentNode.getAttribute('data-id'));

    // Search (filter)
    var newArray = todoArray.searchForValue('id', changeId, true);

    newArray[0].check = /(check)/.test(obj.parentNode.className);
}

// Check Todo
function checkTodo(element) {
    // change check icon
    element.classList.toggle('x');
    // add opacity to parent
    element.parentNode.classList.toggle('check');
    // change the ToDo object
    changeTodoCheck(element);
}


/*******************************/
//  DELETE ToDo Array
/*******************************/
function deleteTodo(obj) {
    'use strict';
    //Get id from parent node
    var deleteId = parseInt(obj.parentNode.getAttribute('data-id'));

    // Search (filter) (returns every none matching id)
    var newArray = todoArray.searchForValue('id', deleteId, false);

    // replace the todoArray with a new array without the deleted todo
    todoArray = newArray;
}



/*******************************/
// CONSTRUCTOR, ToDo Object
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
        todoWrapper.className = 'todo-wrapper animated fadeInDown';
        todoWrapper.setAttribute('data-id', this.id);

        // Check box element
        var label = document.createElement('i');
        label.className = 'label-btn material-icons ' + this.color;

        // TESTING!
        // var changeColorWrapper = document.createElement('div');
        // changeColorWrapper.className = 'change-color';

        // var changeColor1 = document.createElement('i');
        // changeColor1.className = 'label-btn material-icons yellow'
        // var changeColor2 = document.createElement('i');
        // changeColor2.className = 'label-btn material-icons green'
        // var changeColor3 = document.createElement('i');
        // changeColor3.className = 'label-btn material-icons blue'
        // var changeColor4 = document.createElement('i');
        // changeColor4.className = 'label-btn material-icons red'

        // changeColorWrapper.appendChild(changeColor1);
        // changeColorWrapper.appendChild(changeColor2);
        // changeColorWrapper.appendChild(changeColor3);
        // changeColorWrapper.appendChild(changeColor4);

        // changeColorWrapper.addEventListener('click', function() {
        //     console.log('Here!');
        //     this.parentNode.previousSibling.className = this.className;
        // });
        
        


        // input element
        var todoText = document.createElement('input');
        todoText.className = 'todo-text';
        todoText.setAttribute('type', 'text');
        todoText.setAttribute('value', this.text);
        // todoText.setAttribute('readonly', 'readonly');

        // Remove element
        var remove = document.createElement('i');
        remove.className = 'remove-btn material-icons animated';
        remove.textContent = 'clear';

        // ------------- Add Event Listeners

        // dbclick to remove 'readonly' attribute
        todoText.addEventListener('click', function () {
            // this.removeAttribute('readonly');
        });

        // dbclick to remove 'readonly' attribute
        todoText.addEventListener('focus', function () {
            // this.removeAttribute('readonly');
            // this.previousSibling.classList.add('show');
        });

        // blur to add 'readonly' attribute
        todoText.addEventListener('blur', function () {
            // this.setAttribute('readonly', 'readonly');
            // btnWrapper.classList.toggle('show');
            // this.previousSibling.classList.remove('show');
        });



        // Change a todo
        todoText.addEventListener('change', function () {
            changeTodo(this);
        });

        // Check todo
        label.addEventListener('click', function() {
            checkTodo(this);
        });

        // Remove todo
        remove.addEventListener('click', function () {
            var eRemove = this;
            this.parentElement.classList.add('animated', 'flipOutX');
            setTimeout(function () {
                eRemove.parentElement.parentElement.removeChild(eRemove.parentElement);
                deleteTodo(eRemove);
            }, 700);
            
        });

        // If checked add css classes
        if (check) {
            label.classList.add('x');
            todoWrapper.classList.toggle('check');
        }

        // Add all nodes to the wrapper
        todoWrapper.appendChild(label);
        // todoWrapper.appendChild(changeColorWrapper);
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
    // Render all doto one by one, + animation
    function doSetTimeout(i) {
        setTimeout(function() {
            target.appendChild(array[i].create()); 
        }, i * 100);
    }

    for (var i = 0; i < array.length; ++i) {
        doSetTimeout(i);
    }
}

// Render a single Todo
function renderTodo(object, target) {
    'use strict';
    target.appendChild(object);
}

// addEventListener, show color options
mainBtn.addEventListener('click', function() {
    btnWrapper.classList.toggle('show');
});

// addEventListener, picking color option
btn.forEach(function(element) {
    element.addEventListener('click', function() {
        //Change the color on main btn
        mainBtn.className = this.classList[0];
        btnWrapper.classList.toggle('show');
        tInput.focus();
    });
});

// addEventListener for Enter pless, adds the todo
tInput.addEventListener("keypress", function (e) {
    'use strict';
	if (e.keyCode === 13) {
	    createTodo();
	}
});

// addEventListener check all todo
checkAllBtn.addEventListener('click', function() {
    var e = this;
    // Kontroll if to check all or uncheck all
    if (/(all)/.test(e.className)) {
        e.classList.remove('all');
        document.querySelectorAll('.label-btn').forEach(function(element) {
            // change check icon
            element.classList.add('x');
            // remove classes from parent
            element.parentNode.classList.remove('animated', 'fadeInDown')
            // add opacity to parent
            element.parentNode.classList.add('check');
            // change the ToDo object
            changeTodoCheck(element);
        });
    } else {
        e.classList.add('all');
        document.querySelectorAll('.label-btn').forEach(function(element) {
            // change check icon
            element.classList.remove('x');
            // remove classes from parent
            // element.parentNode.classList.add('animated', 'fadeInDown')
            // add opacity to parent
            element.parentNode.classList.remove('check');
            // change the ToDo object
            changeTodoCheck(element);
        });
    }
});

// addEventListener delete att checked
deleteAllBtn.addEventListener('click', function() {
    // Remove all objects
    var newArray = todoArray.searchForValue('check', true, false);
    // if the array is changed
    if (todoArray.length !== newArray.length) {
        // overrite the old array
        todoArray = newArray;
        // Render all todo objects
        renderTodoAll(todoArray, listWrapper);
    }
})

// sort and render new elements, az class added to reverse order.
function sortView(element, property) {
    if (/az/.test(element.className)) {
        element.classList.toggle('az');
        renderTodoAll(todoArray.sortByProp(property).reverse(), listWrapper);
    } else {
        element.classList.toggle('az');
        renderTodoAll(todoArray.sortByProp(property), listWrapper);
    }
}

// addEventListener sort by name
sortNameBtn.addEventListener('click', function() {
    sortView(this, 'name');
});

// addEventListener sory by id
sortIdBtn.addEventListener('click', function() {
    sortView(this, 'id');
});

// addEventListener sort by color
sortColorBtn.addEventListener('click', function() {
    sortView(this, 'color');
});

// addEventListener filter by color
var filterClick = 1;
filterBtn.addEventListener('click', function() {
    // change what color to filter for every click
    switch (filterClick) {
        case 1:
            renderTodoAll(todoArray.searchForValue('color', 'green', true), listWrapper);
            filterClick++;
            break;
        case 2:
            renderTodoAll(todoArray.searchForValue('color', 'blue', true), listWrapper);
            filterClick++;
            break;
        case 3:
            renderTodoAll(todoArray.searchForValue('color', 'yellow', true), listWrapper);
            filterClick++;
            break;
        case 4:
            renderTodoAll(todoArray.searchForValue('color', 'red', true), listWrapper);
            filterClick++;
            break;
        case 5:
            renderTodoAll(todoArray, listWrapper);
            filterClick = 1;
            break;
    }
});









// Testing!
var a = document.querySelector('#list-wrapper');

todoArray.push(new Todo('green', 'get a kick-ass internship!', id++, false));
todoArray.push(new Todo('yellow', 'fix Safari bugg', id++, true));
todoArray.push(new Todo('red', 'add ID system', id++, true));
todoArray.push(new Todo('red', 'cant use DB to save data', id++, true));
todoArray.push(new Todo('green', 'We need animation!', id++, false));
todoArray.push(new Todo('blue', '', id++, false));
todoArray.push(new Todo('green', 'This is way too long!... How do i solv that', id++, false));
todoArray.push(new Todo('green', 'A', id++, false));
todoArray.push(new Todo('green', 'B', id++, false));
todoArray.push(new Todo('green', 'c', id++, false));
todoArray.push(new Todo('green', 'D', id++, false));

// todoArray.push(new Todo('blue', 'B', id++, true));
// todoArray.push(new Todo('yellow', 'g', id++, false));
// todoArray.push(new Todo('red', 'c', id++, false));
// todoArray.push(new Todo('blue', 'EF', id++, false));
// todoArray.push(new Todo('green', 'd', id++, true));
// todoArray.push(new Todo('blue', 'a', id++, false));
// todoArray.push(new Todo('green', 'f', id++, false));
// todoArray.push(new Todo('red', 'k', id++, false));
// todoArray.push(new Todo('blue', 'i', id++, false));
// todoArray.push(new Todo('yellow', 'h', id++, false));
// todoArray.push(new Todo('yellow', 'j', id++, false));


renderTodoAll(todoArray, listWrapper);