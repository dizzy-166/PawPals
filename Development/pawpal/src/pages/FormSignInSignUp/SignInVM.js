import { makeObservable, observable, action, computed } from "mobx";
import { ActualState } from "../../Domain/States/ActualState";
import { SignInState } from "../../Domain/States/SignInState";
import supabase from '../../Domain/Utils/Constant'

class SignInViewModel {
    actualState = ActualState.Init
    signInState = new SignInState()
    messegeError = "Неизветсная ошибка"
    messageSuccess = "Успех"

    constructor(){
        makeObservable(this, {
            actualState: observable,
            signInState: observable,
            updateSignInState: action
        })
    }

    updateSignInState = (newState) => {
        this.signInState = newState
    }

    loagIn = async (updateUser) => {
        this.actualState = ActualState.Loading
        try{
            const { data, error } = await supabase.auth.signInWithPassword({ 
            email: this.signInState.email,
            password: this.signInState.password
        })
        if(error){
            this.messegeError = error.message
            this.actualState = ActualState.Error
            return;
        }
        if(data){
            const user = await supabase.auth.getUser(); // добавлен await
            updateUser(user);
            this.actualState = ActualState.Success
        }
        }
        catch(error){
            this.messegeError = error.message
            this.actualState = ActualState.Error
            return;
        }
    }

    dispose = () =>{
        this.actualState = ActualState.Init
        this.signInState = new SignInState()
    }
}

export default new SignInViewModel()