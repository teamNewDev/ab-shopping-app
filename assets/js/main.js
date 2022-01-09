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
                    <img src="./assets/icon/graph.png" class="qty-icon btm-icon" />
                    <span class="qty">${todo.quantity}</span>
                        <img src="./assets/icon/wallet.png" class="cash-icon btm-icon" />
                    <span class="qty">$${todo.price}</span>
                </div>
        
                <img src="./assets/icon/more.png" class="more-info-icon icon" data-id="${todo.id}" />
    
                <div class="more-info">
                    <img src="./assets/icon/check.png" class="completed icons" data-id="${todo.id}"/>
                    <img src="./assets/icon/edit.png" class="edit icons" data-id="${todo.id}"/>
                    <img src="./assets/icon/delete.png" class="delete icons" data-id="${todo.id}"/>
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