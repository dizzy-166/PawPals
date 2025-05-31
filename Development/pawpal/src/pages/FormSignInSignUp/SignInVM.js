import { makeObservable, observable, action, computed } from "mobx";
import { ActualState } from "../../Domain/States/ActualState";
import { SignInState } from "../../Domain/States/SignInState";
import supabase from '../../Domain/Utils/Constant'


// ViewModel для страницы входа (SignIn)
class SignInViewModel {
    // Текущее состояние страницы (Init, Loading, Success, Error)
    actualState = ActualState.Init

    // Состояние полей формы авторизации (email и password)
    signInState = new SignInState()

    // Сообщение об ошибке по умолчанию
    messegeError = "Неизветсная ошибка"

    // Сообщение об успешной авторизации
    messageSuccess = "Успех"

    constructor() {
        // Делаем поля observable и методы — actions (MobX)
        makeObservable(this, {
            actualState: observable,
            signInState: observable,
            updateSignInState: action
        })
    }

    // Обновление состояния формы авторизации
    updateSignInState = (newState) => {
        this.signInState = newState
    }

    // Метод входа пользователя
    loagIn = async (updateUser) => {
        this.actualState = ActualState.Loading

        try {
            // Попытка авторизации через Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email: this.signInState.email,
                password: this.signInState.password
            })

            // Обработка ошибки входа
            if (error) {
                this.messegeError = error.message
                this.actualState = ActualState.Error
                return
            }

            // Если вход успешен
            if (data) {
                // Получение информации о пользователе
                const user = await supabase.auth.getUser()

                // Обновляем глобальное состояние пользователя (например, в App)
                updateUser(user)

                // Устанавливаем состояние "Успех"
                this.actualState = ActualState.Success
            }

        } catch (error) {
            // Обработка непредвиденных ошибок
            this.messegeError = error.message
            this.actualState = ActualState.Error
            return
        }
    }

    // Сброс состояния ViewModel (например, при выходе со страницы)
    dispose = () => {
        this.actualState = ActualState.Init
        this.signInState = new SignInState()
    }
}

// Экспорт singleton-экземпляра для использования в приложении
export default new SignInViewModel()