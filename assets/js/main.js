
function $(elm) {
    return document.querySelector(elm)
}

function $all(elm) {
    return document.querySelectorAll(elm)
}

function Alert() {

    this.success = (text) => {
        return Swal.fire({
            title: 'Success!',
            text: text,
            icon: 'success',
            confirmButtonText: 'Cool'
        })
    }

    this.error = (text) => {
        return Swal.fire({
            title: 'Failure!',
            text: text,
            icon: 'error',
            confirmButtonText: 'Try again later'
        })
    }

    this.info = (text) => {
        return Swal.fire({
            imageUrl: 'https://avatars.githubusercontent.com/u/65370456?v=4',
            imageHeight: 100,
            imageWidth: 100,
            imageAlt: 'Benrobo',
            title: 'By Benrobo',
            html: "<small>Hope you enjoy making use of this app which i belive you did, kindly follow me on github below 👇👇 😍😍<small>",
            footer: '<a href="https://github.com/benrobo" class="text-primary" target="_blank" >@Benroboa>',
        })
    }
}
let alert = new Alert()

const randId = () => {
    let text = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJIKLMNOPQRSTUV1234567890".split("")
    let id = "";
    for (let i = 0; i < 8; i++) {
        id += text[Math.floor(Math.random() * text.length)];
    }
    return id;
}

const SHOPPING_LIST = async () => {
    let totalText = $(".total-text");
    let todosCont = $(".todos");
    let homeBtn = $(".home-btn");
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
    setTimeout(() => {
        // splashScreen.style.display = "none"
        splashScreen.classList.add("remove")
    }, 2500);

    todosCont.innerHTML = ""

    addBtn.onclick = () => {
        clearForm()
        showAddForm()
    }
    addFormModal.onclick = (e) => {
        if (e.target.classList.contains("addlist-modal")) {
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
        titleInp.value === "";
        priceInp.value = "";
        qtyInp.value = "";
    }

    infoBtn.onclick = () => {
        alert.info("<a>fbgfb</a>")
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
            return alert.error("Inputs fields cant be empty")
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

            alert.success("List added successfully")
            addFormModal.style.display = "none"
            getData()
            populate()
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

    async function populate() {
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
                <ion-icon name="bar-chart" class="qty-icon"></ion-icon>
                <span class="qty">${todo.quantity}</span>
                <ion-icon name="card" class="cash-icon"></ion-icon>
                <span class="qty">$${todo.price}</span>
            </div>
    
            <ion-icon
                name="ellipsis-vertical"
                class="more-info-icon"
                data-id="${todo.id}"
            ></ion-icon>
    
            <div class="more-info">
                <ion-icon name="checkmark-circle" class="completed" data-id="${todo.id}"></ion-icon>
    
                <ion-icon name="create" class="edit" data-id="${todo.id}"></ion-icon>
    
                <ion-icon name="trash" class="delete" data-id="${todo.id}"></ion-icon>
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

                // console.log(completed)

                await db.todos.update(id, { completed: completed ? false : true }).then(function (updated) {
                    if (updated) {
                        populate()
                        console.log("Updated");
                    }
                    else {
                        alert.error("Error, shopping list cant be completed")
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

                titleInp.value = title;
                priceInp.value = price;
                qtyInp.value = quantity;

                submitBtn.onclick = () => {
                    if (titleInp.value === "" || priceInp.value === "" || qtyInp.value === "") {
                        return alert.error("Inputs fields cant be empty")
                    }
                    else if (priceInp.value <= 0 || qtyInp.value <= 0) {
                        priceInp.value = 0
                        qtyInp.value = 0;
                        return;
                    }
                    else {

                        addDataToDb(listId, titleInp.value, priceInp.value, qtyInp.value, completed)

                        alert.success("List updated successfully")
                        addFormModal.style.display = "none"
                        getData()
                        populate()
                        calcTotal(list)
                    }
                }

                // console.log(completed)

                // await db.todos.update(id, { completed: completed ? false : true }).then(function (updated) {
                //     if (updated) {
                //         populate()
                //         console.log("Updated");
                //     }
                //     else {
                //         alert.error("Error, shopping list cant be completed")
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
                    alert.success("List deleted successfully")
                    populate()
                    calcTotal(list)
                }).catch((err) => {
                    alert.error("Failed to delete item")
                });
            }
        })

        calcTotal(list)
    }
    populate()

    // delete all items
    deleteAll.onclick = async () => {
        const chk = confirm("Are you sure you wanna delete it")

        if (!chk) return;

        await db.todos.clear()
            .then(async (data) => {
                console.log(data)
                let list = await getData()
                calcTotal(list)
                alert.success("All items deleted successfully")
                populate()
            })
            .catch((err) => {
                console.log(err)
                if (err) {
                    alert.error("Failed to delete all items")
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

SHOPPING_LIST()