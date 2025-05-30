import { action, makeObservable, observable } from "mobx"
import { ActualState } from "../../Domain/States/ActualState"
import { SignUpState } from "../../Domain/States/SignUpState"
import supabase from '../../Domain/Utils/Constant'

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


    regIn = async () => {
        this.actualState = ActualState.Loading
        if(this.signUpState.email === "" || this.signUpState.name === "" || this.signUpState.lastName === ""){
            this.actualState = ActualState.Error
            this.messegeError = "есть пустые поля"
            return
        }
        else if(this.signUpState.password !== this.signUpState.confirmPassword){
            this.actualState = ActualState.Error
            this.messegeError = "пароли не совпадают"
            return
        }
        try{
            const { data, error } = await supabase.auth.signUp({ 
            email: this.signUpState.email,
            password: this.signUpState.password
         })
    
        if(error){
            this.actualState = ActualState.Error
            this.messegeError = error.message
            return;
        }
        if(data){
            const {error} = await supabase.from('Profile').insert({
                id: data.user.id,
                name: this.signUpState.name,
                lastname: this.signUpState.lastName,
                dateBirth: this.signUpState.birthDate
            })
            if(!error){
                this.actualState = ActualState.Success
            }
            if(error){
                this.actualState = ActualState.Error
            this.messegeError = error.message
            }
        }
        }
        catch(error){
            this.actualState = ActualState.Error
            this.messegeError = error.message
        }
    }
    

    dispose = () =>{
            this.actualState = ActualState.Init
            this.signUpState = new SignUpState()
    }
}

export default new SingUpVM()