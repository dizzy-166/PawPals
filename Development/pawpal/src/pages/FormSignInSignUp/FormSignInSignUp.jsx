import '../styles/MainStyles.css';
import { useState } from 'react';
import { SignIn } from './SignIn'
import { SignUp } from "./SignUp";



export function FormSignInSignUp({setShow, updateUser}){

    const [itSignIn, changeItSignIn] = useState(true)
    

    return(
    <>
    {itSignIn && (<SignIn onToggleAuth={changeItSignIn} setShowing={setShow} updateUser = {updateUser}/>)}
    {!itSignIn && (<SignUp onToggleAuth={changeItSignIn}/>)}
    </>
    )
}