//Variables

let todoItems = []
const todoInput = document.querySelector('.todo-input')
const completedTodosDiv = document.querySelector('.completed-todos')
const incompletedTodosDiv = document.querySelector('.incompleted-todos')
const audio = new Audio('./assets/audios/pop.mp3')

// get todo list on first boot
window.onload = () => {
    let storageTodoItems = localStorage.getItem('todoItems')
    if (storageTodoItems !== null) {
        todoItems = JSON.parse(storageTodoItems)
    }

    render()
}


// getting the content typed in input field
todoInput.onkeyup = ((e) => {
    let value = e.target.value.replace(/^\s+/, "") // this takes the text and removes any leading whitespaces

    if (value && e.keyCode == 13) {
        addTodo(value)
        todoInput.value = ''
        todoInput.focus()
    }
})

// add todo
function addTodo(text) {
    todoItems.push({
        id: Date.now(),
        text,
        completed: false
    })
    saveAndRender()
}

// remove todo
function removeTodo(id) {
    todoItems = todoItems.filter(todo => todo.id !== Number(id))
    saveAndRender()
}

// mark as complete
function markAsCompleted(id) {
    todoItems = todoItems.filter(todo => {
        if(todo.id === Number(id)){
            todo.completed = true
        }
        return todo
    })
    audio.play()
    saveAndRender()
}

// mark as incomplete
function markAsIncomplete(id) {
    todoItems = todoItems.filter(todo => {
        if(todo.id === Number(id)){
            todo.completed = false
        }
        return todo
    })
    saveAndRender()
}

// save locally
function save() {
    localStorage.setItem('todoItems', JSON.stringify(todoItems))
}

// render 
function render() {
    let incompletedTodos = todoItems.filter(item => !item.completed)
    let completedTodos = todoItems.filter(item => item.completed)

    completedTodosDiv.innerHTML = ''
    incompletedTodosDiv.innerHTML = ''

    if (incompletedTodos.length > 0) {
        incompletedTodos.forEach(todo => {
            incompletedTodosDiv.append(createTodoElement(todo))
        })
    }
    else {
        incompletedTodosDiv.innerHTML = `<div class='empty'> No incomplete task </div>`
    }

    if (completedTodos.length > 0) {
        completedTodosDiv.innerHTML = `<div class = 'completed-title'> Completed (${completedTodos.length} / ${todoItems.length})</div>`

        completedTodos.forEach(todo => {
            completedTodosDiv.append(createTodoElement(todo))
        })
    }
}

// save and render
function saveAndRender() {
    save()
    render()
}

// create todo list item
function createTodoElement(todo) {
    // create todo-item container
    const todoDiv = document.createElement('div')
    todoDiv.setAttribute('data-id', todo.id)
    todoDiv.className = 'todo-item'

    // create todo-item text
    const todoTextSpan = document.createElement('span')
    todoTextSpan.innerHTML = todo.text

    // checkbox for list
    const todoInputCheckbox = document.createElement('input')
    todoInputCheckbox.type = 'checkbox'
    todoInputCheckbox.checked = todo.completed
    todoInputCheckbox.onclick = (e) => {
        let id = e.target.closest('.todo-item').dataset.id
        e.target.checked ? markAsCompleted(id) : markAsIncomplete(id)
    }

    // delete button for list
    const todoRemoveBtn = document.createElement('a')
    todoRemoveBtn.href = '#'
    todoRemoveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24"
    height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
    stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M18 6l-12 12"></path>
    <path d="M6 6l12 12"></path>
    </svg>`
    todoRemoveBtn.onclick = (e) => {
        let id = e.target.closest('.todo-item').dataset.id
        removeTodo(id)
    }

    todoTextSpan.prepend(todoInputCheckbox)
    todoDiv.appendChild(todoTextSpan)
    todoDiv.appendChild(todoRemoveBtn)

    return todoDiv
}