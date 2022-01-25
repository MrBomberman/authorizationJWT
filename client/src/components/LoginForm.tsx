import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Context } from '..';

const LoginForm = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('');

    const {store} = useContext(Context)

    return (
        <div className='container'>
            <h1 className='title'>REGISTRATION FORM</h1>
                <div className='registrationForm'>
                    <div className='divInput'>
                        <input 
                        className='inputForm'
                        onChange={((e) => setEmail(e.target.value))}
                        value={email}
                        type="email" 
                        placeholder='Email' />
                    </div>
                    <div className='divInput'>
                    <input 
                        className='inputForm'
                        onChange={((e) => setPassword(e.target.value))}
                        value={password}
                        type="password" 
                        placeholder='Password' />
                    </div>
                    <div>
                        <button className='button-27' onClick={() => store.login(email, password)}>
                            LOGIN
                        </button>
                    </div>
                    <div>
                        <button className='button-27' onClick={() => store.registration(email, password)}>
                            REGISTRATION
                        </button>
                    </div>
                </div>
            {/* </div> */}
        </div>
    )
}

export default observer(LoginForm);