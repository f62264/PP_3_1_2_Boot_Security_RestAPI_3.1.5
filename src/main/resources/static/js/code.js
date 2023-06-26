document.addEventListener("DOMContentLoaded", async function verification() {

    //получение всех юзеров

    const allusers = document.querySelector('#tableUsers tbody')
    const url = 'http://localhost:8080/api/admin'
    const getAllUsers = async () => {
        const response = await fetch(url);
        if (response.ok) {
            const users = await response.json();
            let output = ''
            users.forEach(user => {
                output += `<tr id="userData${user.id}">
                         <td>${user.id}</td>
                         <td>${user.username}</td>
                         <td>${user.email}</td>
                         <td>${user.roles.map(role => role.name).join(' ')}</td>
                         <td>
                             <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-userid="${user.id}" data-action="edit" id="getEditModal" value="edit">Edit</button>
                         </td>
                         <td>
                           <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-userid="${user.id}"  data-action="delete" id="getDeleteModal" value="delete">Delete</button>
                         </td>
                       </tr>`
            })
            allusers.innerHTML = output
        } else {
            console.error('Ошибка при получении данных:', response.status);
        }
    }

    // получение авторизированного юзера

    async function getUserHeader() {
        let get = await fetch('api/user')
        if (get.ok) {
            const userHeader = document.querySelector('#info')
            let json = await get.json();
            let output = `<td>${json.email}</td> 
                                <span> with roles </span>
                         <td>${json.roles.map(role => role.name).join(' ')}</td>
                       </tr>`
            userHeader.innerHTML = output
        } else {
            console.error('Ошибка при получении данных:', get.status);
        }
    }

    //проверка роли

    let isUser = true
    const roles = await fetch('api/user')
    let role = ''
    let json = await roles.json()
    for (let i = 0; i < json.roles.length; i++) {
        role = json.roles[i].name
        if (role === "ADMIN") {
            isUser = false
        }
    }
    if (isUser) {
        document.getElementById('admin-tab').style.display = 'none'
        document.getElementById('admin').style.display = 'none'
        document.getElementById('user-tab').classList.add('active')
        document.getElementById('user').classList.add('show', 'active')
        await getUser()
    } else {
        document.getElementById('admin-tab').classList.add('active')
        document.getElementById('admin').classList.add('show', 'active')
        await getAllUsers()
    }
    //вывод инф. о пользователе в хедер
    const headerInfo = document.getElementById('info')
    let userHeader = getUserHeader()
    headerInfo.textContent = `Logged in as: ${userHeader}`
    //создание модальных окон
    const ModalEditUser = new bootstrap.Modal(document.getElementById('ModalEditUser'), {
        focus: false
    });
    const ModalDeleteUser = new bootstrap.Modal(document.getElementById('ModalDeleteUser'), {
        focus: false
    });

// гет метод - для получения таблицы всех юзеров

    fetch(url)
        .then(res => res.json())
        .then(data => getAllUsers(data))

    // Создание нового юзера

    let roleList = [
        {id: 1, name: "USER"},
        {id: 2, name: "ADMIN"}
    ]

    let getRole = () => {
        let array = [];
        let role = document.querySelector('#Inputrole');
        for (let i = 0; i < role.length; i++) {
            if (role[i].selected) {
                array.push(roleList[i])
            }
        }
        return array;
    }

    document.querySelector('#addNewUser').addEventListener("click", async function add(evt) {
        evt.preventDefault();
        let addForm = document.querySelector('#formAddUser')
        let username = addForm.username.value;
        let email = addForm.email.value;
        let password = addForm.password.value;
        let user = {
            username: username,
            email: email,
            password: password,
            roles: getRole()
        }

        if (username.trim() === '' || email.trim() === '' || password.trim() === '') {
            // Если одно из полей пустое, выполните соответствующие действия
            alert('Заполните все поля');
            return;
        }

        let addUser = await fetch('api/admin',
            {
                method: "POST",
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(user)
            });
        if (addUser.ok) {
            await getAllUsers();
            let addForm = $('#formAddUser')
            addForm.find('#username').val('');
            addForm.find('#emailNewUser').val('');
            addForm.find('#passwordNewUser').val('');
            addForm.find(getRole()).val('');
        } else {
            alert('Такой пользователь уже существует')
        }

    })

    //редактирование юзера

    const on = (element, event, selector, handler) => {
        element.addEventListener(event, async e => {
            if (e.target.closest(selector)) {
                try {
                    await handler(e);
                } catch (error) {
                    console.error('Ошибка при обработке данных:', error);
                }
            }
        });
    };

    on(document, 'click', '#getEditModal', async e => {
        const row = e.target.parentNode.parentNode
        idForm = row.children[0].innerHTML
        const username = row.children[1].innerHTML
        const email = row.children[2].innerHTML
        const role = row.children[3].innerHTML
        let getOneUser = await fetch(`api/admin/${idForm}`);
        let json = getOneUser.json();
        let password = json.password;
        idEdit.value = idForm
        EditUsername.value = username
        EditEmail.value = email
        rolesEdit.value = role
        EditPassword.value = password;
        ModalEditUser.show()
    })


    document.querySelector('#modalBtn').addEventListener("click", async function edit(evt) {
        evt.preventDefault();
        let editForm = document.querySelector('#editForm')
        let id = editForm.idEdit.value;
        let username = editForm.EditUsername.value;
        let email = editForm.EditEmail.value;
        let password = editForm.EditPassword.value;
        let getEditRole = () => {
            let array = [];
            let role = document.getElementById('rolesEdit');
            for (let i = 0; i < role.length; i++) {
                if (role[i].selected) {
                    array.push(roleList[i])
                }
            }
            return array;
        }

        let editUser = {
            id: id,
            username: username,
            email: email,
            password: password,
            roles: getEditRole()
        }

        if (username.trim() === '' || email.trim() === '' || password.trim() === '') {
            alert('Заполните все поля');
            return;
        }

        let update = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(editUser)
        })
        if (update.ok) {
            await getAllUsers();
            ModalEditUser.hide();
        } else {
            alert('Такой пользователь уже существует')
        }
    })

    //удаление юзера

    on(document, 'click', '#getDeleteModal', async e => {
        const row = e.target.parentNode.parentNode
        idForm = row.children[0].innerHTML
        const username = row.children[1].innerHTML
        const email = row.children[2].innerHTML
        const role = row.children[3].innerHTML
        let getOneUser = await fetch(`api/admin/${idForm}`);
        let json = getOneUser.json();
        let password = json.password;
        idDelete.value = idForm
        deleteUsername.value = username
        deleteEmail.value = email
        rolesDelete.value = role
        deletePassword.value = password;
        ModalDeleteUser.show()
    })

    document.querySelector('#modalBtnDelete').addEventListener("click", async function (evt) {
        let deleteForm = document.querySelector('#deleteForm')
        let id = deleteForm.idDelete.value;
        let deleteUser = await fetch('api/admin/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        if (deleteUser.ok) {
            await getAllUsers();
            ModalDeleteUser.hide();
        }
    })

    //таблица юзера

    async function getUser() {
        let get = await fetch('api/user')
        if (get.ok) {
            const userTable = document.querySelector('#user tbody')
            let json = await get.json();
            let output = `<tr id="userData${json.id}">
                         <td>${json.id}</td>
                         <td>${json.username}</td>
                         <td>${json.email}</td>
                         <td>${json.roles.map(role => role.name).join(' ')}</td>
                       </tr>`
            userTable.innerHTML = output
        } else {
            console.error('Ошибка при получении данных:', get.status);
        }
    }

    document.getElementById('user-tab').addEventListener('click', async function () {
        document.getElementById('user-tab').classList.add('active')
        document.getElementById('user').classList.add('show', 'active')
        await getUser()
    })

    //logout

    document.getElementById('logout').addEventListener('click', async function () {
        window.location.href = '/logout'
    })
})

