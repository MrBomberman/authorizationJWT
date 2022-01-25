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
    <div className='mainPage'>
      <div className='mainBlock'>
      <h1 className='authMail'>{store.isAuth === true ? `User was authorized ${store.user.email}` : 'You need to authorize'}</h1>
      {store.user.isActivated === true ? <h2 className='statusSuccess'>Your account was verified</h2> : 
      <h2 className='statusNotSuccess'>Verify your account!!!</h2>}
      <div>
        <button className='btnUsers' onClick={getUsers}>Get all users</button>
      </div>
      {users.map(user => {
        return <li className='userLi' key={user.email}>{user.email}</li>
      })}
      </div>
      <button className='btnExit' onClick={() => store.logout()}>Exit</button>
    </div>
  );
}

export default observer(App);
