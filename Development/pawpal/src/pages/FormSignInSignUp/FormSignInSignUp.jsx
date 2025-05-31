import '../styles/MainStyles.css';
import { useState } from 'react';
import { SignIn } from './SignIn'
import { SignUp } from "./SignUp";


// форма авторизации и регистрации
export function FormSignInSignUp({setShow, updateUser}){

    const [itSignIn, changeItSignIn] = useState(true) //useState для отображения какой либо формы (по умолчанию авторизации)
    

    return(
    <>
    {/* дополнительно функции для закрытия формы и обновления пользователя (setShow и updateUser) для авторизации*/}
    {itSignIn && (<SignIn onToggleAuth={changeItSignIn} setShowing={setShow} updateUser = {updateUser}/>)}
    {!itSignIn && (<SignUp onToggleAuth={changeItSignIn}/>)}
    </>
    )
}