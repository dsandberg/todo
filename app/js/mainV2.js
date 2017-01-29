
window.onload = function () {
    'use strict';
    //Random Background Image, IIF
    (function randomBG() {
        var randomNr = Math.floor(Math.random() * 9) + 1;
        document.querySelector('body').style.backgroundImage = "url('img/" + randomNr + ".jpg')";
    }());

    // Adds a shake effect to the wrapper elements
    function shake() {
        wrapper.classList.toggle('shake');
        setTimeout(function () {
            wrapper.classList.toggle("shake");
        }, 200);
    }

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
        if (todoArray.length >= 1) {
            todoArray.forEach(function (element) {
                if (element.id > id) {
                    id = element.id;
                }
            });
            id = id + 1;
        }
    }

        /*******************************/
    // CONSTRUCTOR, ToDo Object
    /*******************************/
    function TodoObj(color, text, id, check, trash) {

        this.color = color || "green";
        this.text = text || "";
        this.id = id || 0;
        this.check = check || false;
        this.trash = trash || false;
    }

    /*******************************/
    // Methods on TodoObj prototype
    /*******************************/
    TodoObj.prototype = {

        // Change text
        changeText: function (node) {
            if (node.value) {
                this.text = node.value;
            } else {
                shake();
                node.value = this.text;
            }
            updateList();
            return this;
        },

        // Change checked
        changeCheck: function (node) {
            // if false set to true, true set to false;
            this.check = this.check ? false : true;

            // Change the DOM, add & remove classes
            if (this.check) {
                node.classList.add('x');
                node.parentNode.classList.add('check');
            } else {
                node.classList.remove('x');
                node.parentNode.classList.remove('check');
            }
            updateList();
            return this;
        },

        // Delete todo
        changeRemove: function (node) {
            this.trash = true;
            // Remove node from the DOM, Timeout for effect
            node.parentElement.classList.add('animated', 'flipOutX');
            setTimeout(function () {
                node.parentElement.parentElement.removeChild(node.parentElement);
            }, 700);
            updateList();
            return this;
        },

        // Create nodes
        createNodes: function () {

            // Set this to self,
            var self = this;

            // Wrapper div element
            var todoWrapper = document.createElement('div');
            todoWrapper.className = 'todo-wrapper animated fadeInDown';
            todoWrapper.setAttribute('data-id', this.id);

            // Check box element
            var label = document.createElement('i');
            label.className = 'label-btn material-icons ' + this.color;

            // Text element (input)
            var todoText = document.createElement('input');
            todoText.className = 'todo-text';
            todoText.setAttribute('type', 'text');
            todoText.setAttribute('value', this.text);

            // Remove element
            var remove = document.createElement('i');
            remove.className = 'remove-btn material-icons animated';
            remove.textContent = 'clear';

            // ------------- Add Event Listeners
            // Change text
            todoText.addEventListener('change', function () {
                self.changeText(this);
            });

            // Check todo
            label.addEventListener('click', function () {
                self.changeCheck(this);
            });

            // Remove todo
            remove.addEventListener('click', function () {
                self.changeRemove(this);
            });

            // If checked add css classes
            if (this.check) {
                label.classList.add('x');
                todoWrapper.classList.toggle('check');
            }

            // Add all nodes to the wrapper
            todoWrapper.appendChild(label);
            todoWrapper.appendChild(todoText);
            todoWrapper.appendChild(remove);

            return todoWrapper;
        }
    };

    //------------------------------/
    // Methods added to the Array prototype
    //------------------------------/
    // Search For Value method (added to the array prototype)
    // Three arguments, property & value to search for and...
    // boolean defines if to return search matches(true) or not matches(false)
    // Return new array
    Array.prototype.searchForValue = function (property, value, boolean) {
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
    Array.prototype.sortByProp = function (property) {
        // compare the first with the second element in the array
        var sorted = this.slice(0).sort(function (first, second) {
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
            stringArray.forEach(function (e) {
                var tempObject = JSON.parse(e);
                jsonArray.push(new TodoObj(tempObject.color, tempObject.text, tempObject.id, tempObject.check));
            });
        }
        return jsonArray;
    }

    // Save all todo objects to cookie
    function saveCookie(array) {
        var cookieString = 'JSONobject=';
        array.forEach(function (element) {
            // add objects as a json string
            cookieString += '|' + JSON.stringify(element);
        });
        document.cookie = cookieString;
    }

    // Get cookie if any + update the id, IIF
    (function () {
        if (document.cookie) {
            todoArray = getCookie();
            idCheck();
        }
    }());

    // Function to keep the todoArray and cookie up to date
    function updateList() {
        // Delete all removed Todo Objects (trash = true);
        todoArray = todoArray.filter(function (e) {
            return e.trash === false ? true : false;
        });

        saveCookie(todoArray);
    }

    /*******************************/
    //  CREATE Todo object
    /*******************************/
    function createTodo() {
        if (tInput.value) {
            // get text from input
            var text = tInput.value;
            // get color from color picker
            var color = mainBtn.className;
            var newTodo = new TodoObj(color, text, id++);

            // Push new Todo object and render
            todoArray.push(newTodo);
            listWrapper.appendChild(todoArray[todoArray.length - 1].createNodes());

            // Clear tInput
            tInput.value = '';
        } else {
            shake();
        }
        updateList();
    }

    // addEventListener for Enter press, adds the todo
    tInput.addEventListener("keypress", function (e) {
        if (e.keyCode === 13) {
            createTodo();
        }
    });

    /************************************/
    // EventListeners for color pick
    /************************************/
    // addEventListener, show color options
    mainBtn.addEventListener('click', function () {
        btnWrapper.classList.toggle('show');
    });

    // addEventListener, picking color option
    btn.forEach(function (element) {
        element.addEventListener('click', function () {
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
        // Remove all old nodes
        while (target.firstChild) {
            target.removeChild(target.firstChild);
        }

        // Timeout function
        // Argument for multiplying the time
        function addOneByOne(nr) {
            setTimeout(function () {
                target.appendChild(array[nr].createNodes());
            }, nr * 100);
        }

        // Add the objects one by obe with delay (addOneByOne).
        // The index nr is used as an argument for the timeoute function
        array.forEach(function (element, index) {
            addOneByOne(index);
        });
    }

    /************************************/
    // EventListeners footer functions (Select all, Delete checked, Sort & Filter)
    /************************************/
    // addEventListener - Check All -
    checkAllBtn.addEventListener('click', function () {
        var self = this;
        var activeTodos = listWrapper.querySelectorAll('.todo-wrapper');

        // Check or uncheck all visible todo objects (work with filters)
        if (/(all)/.test(self.className)) {
            activeTodos.forEach(function (e) {
                if (!(/(check)/.test(e.className))) {
                    // Add checked classes
                    e.classList.add('check');
                    e.firstChild.classList.add('x');
                    // target todo object and set check to true
                    todoArray.searchForValue('id', parseInt(e.getAttribute('data-id')), true)[0]
                        .check = true;
                }
            });
            self.classList.remove('all');
        } else {
            activeTodos.forEach(function (e) {
                if (/(check)/.test(e.className)) {
                    // Remove checked classes
                    e.classList.remove('check');
                    e.firstChild.classList.remove('x');
                    // target todo object and set check to false
                    todoArray.searchForValue('id', parseInt(e.getAttribute('data-id')), true)[0]
                        .check = false;
                }
            });
            self.classList.add('all');
        }
        updateList();
    });

    // addEventListener - Delete all checked -
    deleteAllBtn.addEventListener('click', function () {
        // Get all none checked todo objects
        var newArray = todoArray.searchForValue('check', true, false);
        // if the array is changed
        if (todoArray.length !== newArray.length) {
            // Override the old array
            todoArray = newArray;
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
    sortTextBtn.addEventListener('click', function () {
        sortView(this, 'text');
    });

    // addEventListener -- Sort by time and id --
    sortIdBtn.addEventListener('click', function () {
        sortView(this, 'id');
    });

    // addEventListener -- Sort by color --
    sortColorBtn.addEventListener('click', function () {
        sortView(this, 'color');
    });

    // addEventListener -- Filter by color --
    // filterClick to count clicks
    var filterClick = 1;
    filterBtn.addEventListener('click', function () {
        // Filter only if the color exist
        function filterOnlyIf(color) {
            var temp = [];
            filterClick = filterClick + 1;
            temp = todoArray.searchForValue('color', color, true);
            if (temp.length >= 1) {
                renderTodoAll(temp, listWrapper);
                return true;
            }
        }

        // Use the filterClick counter to change color to filter
        // if filterOnlyIf() === true prevent fall through. else fall through to next case
        switch (filterClick) {
        case 1:
            if (filterOnlyIf('green')) {
                break;
            }
            // falls through
        case 2:
            if (filterOnlyIf('blue')) {
                break;
            }
            // falls through
        case 3:
            if (filterOnlyIf('yellow')) {
                break;
            }
            // falls through
        case 4:
            if (filterOnlyIf('red')) {
                break;
            }
            // falls through
        case 5:
            filterClick = 1;
            renderTodoAll(todoArray, listWrapper);
            break;
        }
    });

    // Render the todo objects
    renderTodoAll(todoArray, listWrapper);
};