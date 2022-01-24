import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Context } from '..';

const LoginForm = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('');

    const {store} = useContext(Context)

    return (
        <div className='container'>
            {/* <div>
                <img className='imgPic' src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Great_Wave_off_Kanagawa.jpg/1280px-The_Great_Wave_off_Kanagawa.jpg" alt="" />
            </div> */}
            {/* <div className='formBlock'> */}
                <div className='registrationForm'>
                    <input 
                    onChange={((e) => setEmail(e.target.value))}
                    value={email}
                    type="email" 
                    placeholder='Email' />
                    <input 
                    onChange={((e) => setPassword(e.target.value))}
                    value={password}
                    type="password" 
                    placeholder='Password' />
                    <button onClick={() => store.login(email, password)}>
                        LOGIN
                    </button>
                    <button onClick={() => store.registration(email, password)}>
                        REGISTRATION
                    </button>
                </div>
            {/* </div> */}
        </div>
    )
}

export default observer(LoginForm);