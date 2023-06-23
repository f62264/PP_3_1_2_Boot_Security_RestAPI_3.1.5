document.addEventListener("DOMContentLoaded", function () {
    const allusers = document.querySelector('#tableUsers tbody')
    const url = 'http://localhost:8080/api/admin'
    let option = ''
    // const ModalEditUser = new bootstrap.Modal(document.getElementById('ModalEditUser'))
    const ModalEditUser = document.getElementById('ModalEditUser')

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
                             <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-userid="${user.id}" data-action="edit" id="editButton${user.id}" value="edit" onclick="e=>editButtonClick(e)">Edit</button>
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

// ----------
// гет метод - для получения таблицы всех юзеров
// ----------

    fetch(url)
        .then(res => res.json())
        .then(data => getAllUsers(data))

// -------------
    // Create - Add New User
    // Method: POST
    //----------

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
        console.log(user)
        console.log(JSON.stringify(user))
        console.log(user.roles.map(role => role.name).join(' '))


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
        }
    })

    // const on = (element, event, selector, handler) => {
    //     element.addEventListener(event, e => {
    //         if (e.target.closest(selector)) {
    //             handler(e)
    //         }
    //     })
    // }

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


    document.querySelector('#modalBtn').addEventListener("click", async function add(evt) {
        evt.preventDefault();
        let editForm = document.querySelector('#editForm')
        let id = editForm.idEdit.value;
        let username = editForm.EditUsername.value;
        let email = editForm.EditEmail.value;
        let password = editForm.EditPassword.value;


        let editUser = {
            id: id,
            username: username,
            email: email,
            password: password,
            // roles: getRole()
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
            ModalEditUser.hidden;
        }
    })

})

function editButtonClick (event) {
    console.log(event.target)
    console.log('adff')

}