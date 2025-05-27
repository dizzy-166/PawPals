import React from "react"
import '../styles/MainStyles.css';
import { useState } from 'react';
import supabase from '../../Domain/Utils/Constant'
import { observer } from "mobx-react";
import SignUpVM from "./SignUpVM";


export const SignUp = observer(({ onToggleAuth }) => {
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

    const { actualState, signUpState, updateSignUpState, dispose } = SignUpVM

    const [showPassword, setShowPassword] = useState(false);

    return(
        <div className="formsign">
            <div className="titleform">
                Регистрация
            </div>
            <div className="input-group">
                <input type="text" className="input-field" placeholder="Введите имя" value={signUpState.name} onChange={(e) => {updateSignUpState({
                    ...signUpState,
                    name: e.target.value
                })}}/>
                <input type="text" className="input-field" placeholder="Введите фамилию" value={signUpState.lastName} onChange={(e) => {updateSignUpState({
                    ...signUpState,
                    lastName: e.target.value
                })}}/>
                <input type="text" className="input-field" placeholder="Email" value={signUpState.email} onChange={(e) => {updateSignUpState({
                    ...signUpState,
                    email: e.target.value
                })}}/>
                <input type={showPassword ? 'text' : 'password'} className="input-field" placeholder="Пароль" value={signUpState.password} onChange={(e) => {updateSignUpState({
                    ...signUpState,
                    password: e.target.value
                })}}/>
                <input type={showPassword ? 'text' : 'password'} className="input-field" placeholder="Повторите пароль" value={signUpState.confirmPassword} onChange={(e) => {updateSignUpState({
                    ...signUpState,
                    confirmPassword: e.target.value
                })}}/>
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
})