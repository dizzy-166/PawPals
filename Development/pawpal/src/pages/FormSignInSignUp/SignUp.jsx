import React from "react"
import '../styles/MainStyles.css';
import { useState } from 'react';
import supabase from '../../Domain/Utils/Constant'


export function SignUp({ onToggleAuth }){
    const [userName, setName] = useState('')

    const [login, setLogin] = useState('')

    const [pass, setPass] = useState('')

    const [confirmPass, setConfirm] = useState('')

    const changePass = (event) =>{
        setPass(event.target.value)
    }

    const changeLogin = (event) =>{
        setLogin(event.target.value)
    }

    const changeName = (event) =>{
        setName(event.target.value)
    }

    const changeConfirm = (event) =>{
        setConfirm(event.target.value)
    }

    const [message, changeMessage] = useState('')

    const handleSubmit = async (event) => { 
        
        const { data, error } = await supabase.auth.signUp({ 
            email: login,
            password: pass
        })

        if(error){
            changeMessage(error.message)
            return;
        }
        if(data){
            changeMessage("user account created")
        }
    }

    return(
        <div className="formsign">
            <div className="titleform">
                Регистрация
            </div>
            <div className="input-group">
                <input type="text" className="input-field" placeholder="Введите имя" value={userName} onChange={changeName}/>
                <input type="text" className="input-field" placeholder="Логин или Email" value={login} onChange={changeLogin}/>
                <input type="text" className="input-field" placeholder="Пароль" value={pass} onChange={changePass}/>
                <input type="text" className="input-field" placeholder="Повторите пароль" value={confirmPass} onChange={changeConfirm}/>
                <button class="button-style" type="submit" onClick={handleSubmit}>Зарегистрироваться</button>
                <p> {message} </p>
            </div>
            <div className="registNav">
            <span>Уже есть аккаунт? </span>
            <a
            className="create-account-link"
            onClick={(e) => { onToggleAuth(true)
            }}>
                Войти
            </a>
            </div>
        </div>
    )
}