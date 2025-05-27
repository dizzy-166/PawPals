import { action, makeObservable, observable } from "mobx"
import { ActualState } from "../../Domain/States/ActualState"
import { SignUpState } from "../../Domain/States/SignUpState"


class SingUpVM{
    actualState = ActualState.Init
    signUpState = new SignUpState()
    messegeError = "Неизветсная ошибка"
    messageSuccess = "Успех"

    constructor(){
        makeObservable(this, {
            actualState: observable,
            signUpState: observable,
            updateSignUpState: action
        })
    }

    updateSignUpState = (newState) => {
        this.signUpState = newState
    }

    dispose = () =>{
            this.actualState = ActualState.Init
            this.signUpState = new SignUpState()
    }
}

export default new SingUpVM()