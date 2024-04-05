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
    private static _button = document.querySelector('button') as HTMLButtonElement;
    static userForm = document.forms['userForm'] as HTMLFormElement;

    private static _getAll(): IUser[] {
        return JSON.parse(localStorage.getItem(this._usersKey)) || [];
    }

    private static _getCurrentUser(): IUser {
        let searchParams = new URLSearchParams(window.location.search);
        return JSON.parse(searchParams.get('user')) as IUser;
    }

    static _setToStorage(data: IUser[]): void {
        localStorage.setItem(this._usersKey, JSON.stringify(data));
        this.renderHTML();
    }

    private static _clearSearchParams(): void {
        let searchParams = new URLSearchParams(window.location.search);
        searchParams.delete('user');
        let newUrl = window.location.pathname + '?' + searchParams.toString();
        window.history.replaceState({}, '', newUrl);
    }

    private static _deleteById(id: number): void {
        const users = this._getAll();
        let index = users.findIndex(user => user.id === id);
        users.splice(index, 1);
        this._setToStorage(users);
    }

    static createUpdate(data: IUserForm): void {
        const users = this._getAll();
        const currentUser = this._getCurrentUser();
        if (currentUser) {
            let index = users.findIndex(user => user.id === currentUser.id);
            users[index] = {id: currentUser.id, ...data};
            this._setToStorage(users);
            this._button.innerText = 'create';
            this._clearSearchParams()

        } else {
            let id = users.length ? users.slice(-1)[0].id + 1 : 1;
            users.push({id, ...data});
            this._setToStorage(users);
        }
    }

    private static _setUserUpdate(user: IUser) {
        const {name: nameInput, age: ageInput} = this.userForm as any as IInput;
        nameInput.value = user.name;
        ageInput.value = user.age.toString();
        // localStorage.setItem(this._currentUser, JSON.stringify(user));
        let searchParams = new URLSearchParams(window.location.search);
        searchParams.set('user', JSON.stringify(user));
        let newUrl = window.location.pathname + '?' + searchParams.toString();
        window.history.pushState({path: newUrl}, '', newUrl);
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
            buttonDelete.onclick = (): void => {
                this._deleteById(user.id);
            }
            const buttonUpdate = document.createElement('button');
            buttonUpdate.innerText = 'update';
            buttonUpdate.onclick = () => {
                this._button.innerText = 'update';
                this._setUserUpdate(user)
            }
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
const userForm = UserService.userForm
const {name: nameInput, age: ageInput} = userForm as any as IInput;
userForm.onsubmit = (e: SubmitEvent): void => {
    e.preventDefault();
    UserService.createUpdate({name: nameInput.value, age: +ageInput.value});
    userForm.reset();
}