import '../styles/MainStyles.css';
import { useState } from 'react';
import { observer } from "mobx-react";
import SignUpVM from "./SignUpVM";
import { Load } from "../../components/Load";
import { ActualState } from "../../Domain/States/ActualState";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const SignUp = observer(({ onToggleAuth }) => {
    
    const { actualState, signUpState, updateSignUpState, dispose, regIn, messegeError } = SignUpVM
    const [birthDate, setBirthDate] = useState(null);
    const [showPassword, changing] = useState(false);

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
                <DatePicker
                selected={birthDate}
                onChange={(date) => {
                    setBirthDate(date);
                    updateSignUpState({
                        ...signUpState,
                        birthDate: date});
                    }}
                    dateFormat="dd.MM.yyyy"
                    placeholderText="Дата рождения"
                    className="input-field"
                    />
                {actualState === ActualState.Init && (<><button class="button-style" type="submit" onClick={() => regIn()}>Зарегистрироваться</button></>)}
                {actualState === ActualState.Error && (<><button class="button-style" type="submit" onClick={() => regIn()}>Зарегистрироваться</button> <p> {messegeError} </p></>)}
                {actualState === ActualState.Loading && (<> <Load/> </>)}
                {actualState === ActualState.Success && ((onToggleAuth(true), dispose()))}
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