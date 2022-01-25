import LoginForm from "./components/LoginForm";
import './App.scss';
import { useContext, useEffect, useState } from "react";
import { Context } from "./index";
import { observer } from "mobx-react-lite";
import {IUser} from './models/response/IUser';
import UserService from "./services/UserService";

function App() {
  const {store} = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if(localStorage.getItem('token')) { // если в локалсторейдж по ключу есть токен, то вызываем функцию проверки аутентификации
      store.checkAuth();
    }
  }, [])

  async function getUsers(){
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch(e) {
      console.log(e);
    }
  }

  if(store.isLoading){
    return <div>Loading...</div>
  }

  if(!store.isAuth) {
    return (
      <LoginForm/>
    )
  }

  return (
    <div>
      <h1>{store.isAuth === true ? `User was authorized ${store.user.email}` : 'You need to authorize'}</h1>
      <h4>{store.user.isActivated === true ? `Your account was verified` : 'Verify your account!!!'}</h4>
      <button onClick={() => store.logout()}>Exit</button>
      <div>
        <button onClick={getUsers}>Get all users</button>
      </div>
      {users.map(user => {
        return <li key={user.email}>{user.email}</li>
      })}
    </div>
  );
}

export default observer(App);
