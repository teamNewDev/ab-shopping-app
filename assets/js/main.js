// Title: Shopping List PWA App
// Creator: Benrobo (Alumona Benaiah)
// github: https://github.com/teamNewDev/ab-shopping-app 


function $(elm) {
    return document.querySelector(elm)
}

function $all(elm) {
    return document.querySelectorAll(elm)
}


const randId = () => {
    let text = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJIKLMNOPQRSTUV1234567890".split("")
    let id = "";
    for (let i = 0; i < 8; i++) {
        id += text[Math.floor(Math.random() * text.length)];
    }
    return id;
}

const SHOPPING_LIST_MAIN = async () => {
    let totalText = $(".total-text");
    let todosCont = $(".todos");
    let infoBtn = $(".info-btn");
    let addForm = $(".addForm-cont");
    let addBtn = $(".add-btn");
    let addFormModal = $(".addlist-modal")
    let deleteAll = $(".delete-all-btn")
    let titleInp = $(".title")
    let qtyInp = $(".quantity")
    let priceInp = $(".price")
    let submitBtn = $(".submit-btn");
    let splashScreen = $(".splash-screen")

    // display splash screen on startup
    // and remove splash screen when this time reaches
    setTimeout(() => {
        splashScreen.classList.add("remove")
    }, 2500);

    todosCont.innerHTML = ""

    addBtn.onclick = () => {
        clearForm()
        showAddForm()
    }
    addFormModal.onclick = (e) => {
        if (e.target.classList.contains("addlist-modal")) {
            submitBtn.innerHTML = "Add Item"
            clearForm()
            hideAddForm()
        }
    }

    function showAddForm(params) {
        addFormModal.style.display = "flex"
        setTimeout(() => {
            addForm.classList.add("slide")
        }, 50);
    }

    function hideAddForm(params) {
        addFormModal.style.display = "none"
        setTimeout(() => {
            addForm.classList.remove("slide")
        }, 50);
    }

    function clearForm() {
        titleInp.value = "";
        priceInp.value = "";
        qtyInp.value = "";
    }

    // init db
    var db = new Dexie("ShoppingList")
    // create table
    db.version(1).stores({
        todos: `
          ++id,
          title,
          price,
          quantity,
          completed
          `,
    });


    submitBtn.onclick = () => {
        if (titleInp.value === "" || priceInp.value === "" || qtyInp.value === "") {
            return alert("Inputs fields cant be empty")
        }
        else if (priceInp.value <= 0 || qtyInp.value <= 0) {
            priceInp.value = 0
            qtyInp.value = 0;
            return;
        }
        else {

            let newid = randId();
            let completed = false;
            addDataToDb(newid, titleInp.value, priceInp.value, qtyInp.value, completed)

            addFormModal.style.display = "none"
            getData()
            populateDOMWithListItem()
            deleteAll.style.display = "flex"

        }
    }

    getData()

    async function addDataToDb(id, title, price, qty, completed) {
        await db.todos.put({ id, title: title, quantity: qty, price, completed })
    }

    async function getData() {
        const list = await db.todos.reverse().toArray()
        if (list.length === 0) {
            deleteAll.style.display = "none"
        }
        return list;
    }
    let list = await getData()
    calcTotal(list)

    async function populateDOMWithListItem() {
        deleteAll.style.display = "flex"
        let list = await getData()
        if (list.length === 0) {
            todosCont.innerHTML = `
                <p>List is empty</p>
            `
            return
        }
        todosCont.innerHTML = ""
        list.forEach((todo) => {
            // console.log(todo)
            todosCont.innerHTML += `
            <div class="todo-card ${todo.completed ? 'completed' : 'notcompleted'}" data-id="${todo.id}">
                <p class="name">${todo.title}</p>
                <div class="bottom">
                <svg xmlns="http://www.w3.org/2000/svg" class="qty-icon btm-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                <span class="qty">${todo.quantity}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="cash-icon btm-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
                </svg>
                    <span class="qty">$${todo.price}</span>
                </div>
        

                <svg xmlns="http://www.w3.org/2000/svg" class="more-info-icon icon"
                data-id="${todo.id}" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" class="more-info-icon" />
                </svg>
    
                <div class="more-info">
                    <svg xmlns="http://www.w3.org/2000/svg" class="completed icons" data-id="${todo.id}" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-id="${todo.id}"/>
                    </svg>  
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="edit icons" data-id="${todo.id}">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" data-id="${todo.id}"/>
                        <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" data-id="${todo.id}"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" class="delete icons" data-id="${todo.id}" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" data-id="${todo.id}"/>
                    </svg>
                </div>
            </div>
            `
        })
        // edit data
        let moreInfo = $all(".more-info");
        let moreIcon = $all(".more-info-icon");
        let completed = $all(".completed")
        let editBtn = $all(".edit")
        let deleteBtn = $all(".delete")


        moreIcon.forEach((more) => {
            more.onclick = (e) => {
                let info = e.target.parentElement.querySelector(".more-info")
                info.classList.toggle("visible")
            }
        })

        // complete a shopping list
        completed.forEach((btn) => {
            btn.onclick = async (e) => {
                let id = e.target.getAttribute("data-id");
                let { completed } = await db.todos.get(id);

                await db.todos.update(id, { completed: completed ? false : true }).then(function (updated) {
                    if (updated) {
                        deleteAll.style.display = "flex"
                        populateDOMWithListItem()
                    }
                    else {
                        alert("Error, shopping list cant be completed")
                    }
                });
            }
        })

        // edit data
        editBtn.forEach((btn) => {
            btn.onclick = async (e) => {
                let listId = e.target.getAttribute("data-id");
                let moreInfo = e.target.parentElement.parentElement.querySelector(".more-info").classList.remove("visible")
                let { completed, price, title, quantity } = await db.todos.get(listId);

                showAddForm()
                submitBtn.innerHTML = "Edit Item"

                titleInp.value = title;
                priceInp.value = price;
                qtyInp.value = quantity;

                submitBtn.onclick = () => {
                    if (titleInp.value === "" || priceInp.value === "" || qtyInp.value === "") {
                        alert("Input field is empty")
                        return
                    }
                    else if (priceInp.value <= 0 || qtyInp.value <= 0) {
                        priceInp.value = 0
                        qtyInp.value = 0;
                        return;
                    }
                    else {
                        submitBtn.innerHTML = "Add Item"

                        addDataToDb(listId, titleInp.value, priceInp.value, qtyInp.value, completed)

                        addFormModal.style.display = "none"
                        getData()
                        deleteAll.style.display = "flex"
                        populateDOMWithListItem()
                        calcTotal(list)
                    }
                }

                // console.log(completed)

                // await db.todos.update(id, { completed: completed ? false : true }).then(function (updated) {
                //     if (updated) {
                //         populateDOMWithListItem()
                //         console.log("Updated");
                //     }
                //     else {
                //         alert("Error, shopping list cant be completed")
                //     }
                // });
            }
        })

        // delete data
        deleteBtn.forEach((btn) => {
            btn.onclick = async (e) => {
                // let list = await getData()
                let id = e.target.getAttribute("data-id");

                await db.todos.where({ id: id }).delete().then(async () => {
                    let list = await getData()
                    deleteAll.style.display = "flex"
                    populateDOMWithListItem()
                    calcTotal(list)
                }).catch((err) => {
                    alert("Failed to delete item")
                });
            }
        })

        calcTotal(list)
    }
    populateDOMWithListItem()

    // delete all items
    deleteAll.onclick = async () => {
        const chk = confirm("Are you sure you wanna delete it")

        if (!chk) return;

        await db.todos.clear()
            .then(async (data) => {
                console.log(data)
                let list = await getData()
                calcTotal(list)
                populateDOMWithListItem()
            })
            .catch((err) => {
                console.log(err)
                if (err) {
                    alert("Failed to delete all items")
                }
            })

    }

    // calculate total
    function calcTotal(list) {
        const totalAmount = list.map((array, num) => {
            return array.price * array.quantity
        }).reduce((total, num) => {
            return total + num
        }, 0)
        totalText.innerHTML = totalAmount
    }

}

SHOPPING_LIST_MAIN()