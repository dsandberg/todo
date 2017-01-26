
window.onload = function () {
    // Load message
    console.log("ToDo, Loaded!");

    // Random Background Image, IIF
    (function randomBG() {
        'use strict';
        var randomNr = Math.floor(Math.random() * 9) + 1;
        document.querySelector('body').style.backgroundImage = "url('img/" + randomNr + ".jpg')";
    }());

    //------------------------------/
    // DOM Selectors, that will never change
    //------------------------------/
    var wrapper = document.querySelector('#wrapper');
    var tInput = document.querySelector('#text-input');
    var mainBtn = document.querySelector('#main-btn');
    var listWrapper = document.querySelector('#list-wrapper');
    var btn = document.querySelectorAll('.btn');
    var btnWrapper = document.querySelector('.btn-wrapper');
    var checkAllBtn = document.querySelector('#check-all');
    var deleteAllBtn = document.querySelector('#delete-all');
    var sortTextBtn = document.querySelector('#sort-byText');
    var sortIdBtn = document.querySelector('#sort-byId');
    var sortColorBtn = document.querySelector('#sort-byColor');
    var filterBtn = document.querySelector('#filter-color');

    //------------------------------/
    // MAIN Array to hold all todo objects
    //------------------------------/
    var todoArray = [];

    //------------------------------/
    // ID System
    //------------------------------/
    // unique id counter (use id++ to assign a new id)
    var id = 100;
    // Check for the highest ID in the array
    function idCheck() {
        'use strict';
        if (todoArray.length >= 1) {
            todoArray.forEach(function(element) {id = element.id > id ? id = element.id : id;});
        id++;
        }
    }

    //------------------------------/
    // Methods added to the Array prototype
    //------------------------------/
    // Search For Value method (added to the array prototype)
    // Three arguments, property & value to search for and...
    // boolean defines if to return search matches(true) or not matches(false)
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
    };

    // Sort By Property method (added to the array prototype)
    // One argument, property to sort by
    // Return new array
    Array.prototype.sortByProp = function(property) {
        // compare the first with the second element in the array
        var sorted = this.slice(0).sort(function(first, second) {
            if (first[property] > second[property]) {
                return 1;
            } else if (first[property] < second[property]) {
                return -1;
            } else {
                return 0;
            }
        });
        // Return sorted array
        return sorted;
    };

    //------------------------------/
    // COOKIE functions
    //------------------------------/
    // Get cookie and parse to objects (return array of objects)
    function getCookie() {
        var stringArray = [];
        var jsonArray = [];
        // Split cookie string
        stringArray = document.cookie.split('|');
        // if JSON object parse to object and push to new array
        if (stringArray[0] === 'JSONobject=') {
            stringArray.shift();
            stringArray.forEach(function(e) {
                var tempObject = JSON.parse(e);
                jsonArray.push(new Todo(tempObject.color, tempObject.text, tempObject.id, tempObject.check));
        });
        }
        return jsonArray;
    }

    // Save all todo objects to cookie
    function saveCookie(array) {
        var cookieString = 'JSONobject=';
        array.forEach(function(element) {
            // add objects as a json string
            cookieString += '|' + JSON.stringify(element);
        });
        document.cookie = cookieString;
    }

    // Get cookie if any + update the id, IIF
    (function() {
        if (document.cookie) {
            console.log('getCookie');
            todoArray = getCookie();
            idCheck();
        }
    }());


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
        saveCookie(todoArray);
    }

    // addEventListener for Enter press, adds the todo
    tInput.addEventListener("keypress", function(e) {
        'use strict';
        if (e.keyCode === 13) {
            createTodo();
        }
    });

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

        // Controls for empty todo
        if (newText) {
            // Change text in Todo
            newArray[0].text = newText;
            } else {
                // shake effect
                shake();
                // Reset value
                obj.value = newArray[0].text;
            }
        saveCookie(todoArray);
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
        saveCookie(todoArray);
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
        saveCookie(todoArray);
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

        // Create a node of the object
        this.create = function () {
            // Wrapper div element
            var todoWrapper = document.createElement('div');
            todoWrapper.className = 'todo-wrapper animated fadeInDown';
            todoWrapper.setAttribute('data-id', this.id);

            // Check box element
            var label = document.createElement('i');
            label.className = 'label-btn material-icons ' + this.color;


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

    /************************************/
    // EventListeners for color picking
    /************************************/
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
            // Focus back to input element.
            tInput.focus();
        });
    });

    /************************************/
    // Render functions, append the todo objects to DOM
    /************************************/
    // Render all Todo objects
    function renderTodoAll(array, target) {
        'use strict';
        // Remove all old nodes
        while (target.firstChild) {
            target.removeChild(target.firstChild);
        }

        function addOneByOne(nr) {
            setTimeout(function() {
                target.appendChild(array[nr].create()); 
            }, nr * 100);
        }

        // Add the objects one by obe with delay. IIF to increase the timeout for every object.
        for (var i = 0; i < array.length; ++i) {
            addOneByOne(i);
        }
    }

    // Render single Todo
    function renderTodo(object, target) {
        'use strict';
        target.appendChild(object);
    }


    /************************************/
    // EventListeners footer functions (Select all, Delete checked, Sort & Filter)
    /************************************/

    // addEventListener - Check All -
    checkAllBtn.addEventListener('click', function() {
        var e = this;
        // Look for all class to check, else uncheck all
        if (/(all)/.test(e.className)) {
            e.classList.remove('all');
            // Select all "check" elements, loop through and add classes for styling
            document.querySelectorAll('.label-btn').forEach(function(element) {
                element.classList.add('x');
                element.parentNode.classList.add('check');
                // change the ToDo object
                changeTodoCheck(element);
            });
        } else {
            e.classList.add('all');
            document.querySelectorAll('.label-btn').forEach(function(element) {
                element.classList.remove('x');
                element.parentNode.classList.remove('check');
                changeTodoCheck(element);
            });
        }
    });

    // addEventListener - Delete all checked -
    deleteAllBtn.addEventListener('click', function() {
        // Get all none checked todo objects
        var newArray = todoArray.searchForValue('check', true, false);
        // if the array is changed
        if (todoArray.length !== newArray.length) {
            // Override the old array
            todoArray = newArray;
            saveCookie(todoArray);
            renderTodoAll(todoArray, listWrapper);
        }
    });

    // Sort todo objects. "za" class to reverse order.
    function sortView(element, property) {
        if (/za/.test(element.className)) {
            element.classList.toggle('za');
            renderTodoAll(todoArray.sortByProp(property).reverse(), listWrapper);
        } else {
            element.classList.toggle('za');
            renderTodoAll(todoArray.sortByProp(property), listWrapper);
        }
    }

    // addEventListener -- Sort by text --
    sortTextBtn.addEventListener('click', function() {
        sortView(this, 'text');
    });

    // addEventListener -- Sort by time and id --
    sortIdBtn.addEventListener('click', function() {
        sortView(this, 'id');
    });

    // addEventListener -- Sort by color --
    sortColorBtn.addEventListener('click', function() {
        sortView(this, 'color');
    });

    // addEventListener -- Filter by color --
    // filterClick to count clicks
    var filterClick = 1;
    filterBtn.addEventListener('click', function() {
        // Filter only if the color exist
        function filterOnlyIf(color) {
            var temp = [];
            filterClick++;
            temp = todoArray.searchForValue('color', color, true);
            if (temp.length >= 1) {
                renderTodoAll(temp, listWrapper);
                return true;
            }
        }

    // Use the filterClick counter to change color to filter 
        switch (filterClick) {
            case 1:
                if (filterOnlyIf('green')) {break;}
            case 2:
                if (filterOnlyIf('blue')) {break;}
            case 3:
            if (filterOnlyIf('yellow')) {break;}
            case 4:
            if (filterOnlyIf('red')) {break;}
            case 5:
                filterClick = 1;
                renderTodoAll(todoArray, listWrapper);
                break;
        }
    });

    renderTodoAll(todoArray, listWrapper);
};