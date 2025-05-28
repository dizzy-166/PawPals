import '../styles/MainStyles.css';
import { useState } from 'react';
import { observer } from "mobx-react";
import SignInVM from "./SignInVM";
import { ActualState } from "../../Domain/States/ActualState";
import {Load} from '../../components/Load'



export const SignIn = observer(({setShowing, onToggleAuth, updateUser}) => {

    const { actualState, signInState, messegeError, updateSignInState, loagIn, dispose } = SignInVM

    const [showPassword, setShowPassword] = useState(false);

    return(
        <div className="formsign">
            <div className="titleform">
                Не узнаем ваши лапки <br/>
                Авторизируйтесь
            </div>
            <div className="input-group">
                <input type="text" className="input-field" placeholder="Логин или Email" value={signInState.email} onChange={(e) => {updateSignInState({
                    ...signInState,
                    email: e.target.value 
                    })}}/>
                <input type={showPassword ? 'text' : 'password'} className="input-field" placeholder="Пароль" value={signInState.password} onChange={(e) => {updateSignInState({
                    ...signInState, 
                    password: e.target.value})}}/>
                {actualState === ActualState.Init && (<><button class="button-style" onClick={() => loagIn(updateUser)}>Войти</button></>)}
                {actualState === ActualState.Error && (<><button class="button-style" onClick={() => loagIn(updateUser)}>Войти</button> <p> {messegeError} </p></>)}
                {actualState === ActualState.Loading && (<> <Load/> </>)}
                {actualState === ActualState.Success && ((setShowing(false), dispose()))}
            </div>
            <div className="registNav">
                <span>Ещё нет аккаунта? </span>
                <a
                className="create-account-link"
                onClick={(e) => { onToggleAuth(false)
                }}>
                    Создать
                </a>
            </div>
        </div>
    )
})
