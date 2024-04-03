interface IUserForm {
    name: string;
    age: number;
}

interface IUser extends IUserForm {
    id: number;
}

interface IInput {
    name: HTMLInputElement;
    age: HTMLInputElement;
}

class UserService {
    private static readonly _usersKey = 'users';

    private static _getAll(): IUser[] {
        return JSON.parse(localStorage.getItem(this._usersKey)) || [];
    }

    private static _setToStorage(data: IUser[]): void {
        localStorage.setItem(this._usersKey, JSON.stringify(data));
        this.renderHTML();
    }

    private static _deleteById(id: number): void {
        const users = this._getAll();
        let index = users.findIndex(user => user.id === id);
        users.splice(index, 1);
        this._setToStorage(users);
    }

    static create(data: IUserForm): void {
        const users = this._getAll();
        let id = users.length ? users.slice(-1)[0].id + 1 : 1;
        users.push({id, ...data});
        this._setToStorage(users);
    }

    static renderHTML(): void {
        const usersContainer = document.getElementsByClassName('usersContainer')[0] as HTMLDivElement;
        usersContainer.innerHTML = '';
        const usersHTMLContent = this._getAll().map(user => {
            const userBlock = document.createElement('div');
            const userContent = document.createElement('div');
            userContent.innerText = `${user.id}. ${user.name} - ${user.age}`;
            const buttonsBlock = document.createElement('div');
            const buttonDelete = document.createElement('button');
            buttonDelete.innerText = 'delete';
            buttonDelete.onclick = () => {
                this._deleteById(user.id);
            }
            const buttonUpdate = document.createElement('button');
            buttonUpdate.innerText = 'update';
            buttonsBlock.append(buttonDelete, buttonUpdate);
            userBlock.append(userContent, buttonsBlock, document.createElement('br'));
            return userBlock;
        });
        if (usersHTMLContent.length) {
            usersContainer.append(...usersHTMLContent);
        } else {
            usersContainer.innerText = 'Users not found or was not added yet';
        }
    }
}

UserService.renderHTML();
let userForm = document.forms['userForm'] as HTMLFormElement;
userForm.onsubmit = (e: SubmitEvent): void => {
    e.preventDefault();
    const {name: nameInput, age: ageInput} = userForm as any as IInput;
    UserService.create({name: nameInput.value, age: +ageInput.value});
    userForm.reset();
}