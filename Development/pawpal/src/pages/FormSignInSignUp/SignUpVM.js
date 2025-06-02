import { action, makeObservable, observable } from "mobx"
import { ActualState } from "../../Domain/States/ActualState"
import { SignUpState } from "../../Domain/States/SignUpState"
import supabase from '../../Domain/Utils/Constant'

// Класс для управления состоянием регистрации пользователя
class SingUpVM {
    // Инициализация состояния - по умолчанию начальное
    actualState = ActualState.Init

    // Состояние формы регистрации (содержит email, имя, пароль и т.д.)
    signUpState = new SignUpState()

    // Сообщение об ошибке (по умолчанию: "Неизвестная ошибка")
    messegeError = "Неизветсная ошибка"

    // Сообщение об успешной регистрации
    messageSuccess = "Успех"

    // Конструктор: делает поля наблюдаемыми и методы — действиями MobX
    constructor() {
        makeObservable(this, {
            actualState: observable,          // отслеживаем изменение состояния
            signUpState: observable,          // отслеживаем данные формы
            updateSignUpState: action         // метод для изменения состояния формы
        })
    }

    // Метод для обновления данных формы регистрации
    updateSignUpState = (newState) => {
        this.signUpState = newState
    }

    // Асинхронный метод регистрации пользователя
    regIn = async () => {
        this.actualState = ActualState.Loading // установка состояния "Загрузка"

        // Проверка: есть ли пустые поля
        if (this.signUpState.email === "" || this.signUpState.name === "" || this.signUpState.lastName === "") {
            this.actualState = ActualState.Error
            this.messegeError = "есть пустые поля" // сообщение об ошибке
            return
        }
        // Проверка: совпадают ли пароли
        else if (this.signUpState.password !== this.signUpState.confirmPassword) {
            this.actualState = ActualState.Error
            this.messegeError = "пароли не совпадают"
            return
        }

        try {
            // Отправка запроса на регистрацию в Supabase
            const { data, error } = await supabase.auth.signUp({ 
                email: this.signUpState.email,
                password: this.signUpState.password
            })
    
            // Обработка ошибки регистрации
            if (error) {
                this.actualState = ActualState.Error
                this.messegeError = error.message
                return
            }

            // Если регистрация успешна, добавляем пользователя в таблицу "Profile"
            if (data) {
                const date = this.signUpState.birthDate;
                const birthDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                console.log('Дата перед отправкой:', this.signUpState.birthDate);
                console.log('Тип:', typeof this.signUpState.birthDate);
                console.log('ISO:', birthDate);
                const { error } = await supabase.from('Profile').insert({
                    id: data.user.id,
                    name: this.signUpState.name,
                    lastname: this.signUpState.lastName,
                    dateBirth: birthDate
                })

                // Проверка на ошибки при добавлении профиля
                if (!error) {
                    this.actualState = ActualState.Success
                }
                else {
                    this.actualState = ActualState.Error
                    this.messegeError = error.message
                }
            }
        } catch (error) {
            // Обработка любых непредвиденных ошибок
            this.actualState = ActualState.Error
            this.messegeError = error.message
        }
    }

    // Метод для сброса состояния (например, при выходе со страницы регистрации)
    dispose = () => {
        this.actualState = ActualState.Init
        this.signUpState = new SignUpState()
    }
}

// Экспорт Singleton экземпляра класса для использования во всем приложении
export default new SingUpVM()