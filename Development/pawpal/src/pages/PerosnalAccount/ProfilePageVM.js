import { action, makeObservable, observable } from "mobx"
import { ActualState } from "../../Domain/States/ActualState"
import supabase from '../../Domain/Utils/Constant'
import { Profile } from "../../Domain/Models/Profile"

// ViewModel для страницы профиля пользователя
class ProfilePageVM {
    // Состояние страницы (по умолчанию Loading)
    actualState = ActualState.Loading

    // Объект профиля пользователя
    profile = new Profile()

    // Сообщения по умолчанию
    messegeError = "Неизветсная ошибка"
    messageSuccess = "Успех"

    constructor() {
        // Подключаем MobX: делаем поля observable и методы actions
        makeObservable(this, {
            actualState: observable,
            profile: observable,
            loadProfile: action,
            updateProfile: action
        })
    }

    // Обновление текущего состояния профиля
    updateProfile = (newState) => {
        this.profile = newState
    }

    // Загрузка профиля по userId из базы данных
    loadProfile = async (userId) => {
        try {
            // Получаем данные профиля из таблицы Profile по id
            const { data, error } = await supabase
                .from('Profile')
                .select('name, lastname, dateBirth')
                .eq('id', userId)
                .single()

            if (error) {
                console.error("Ошибка при загрузке профиля:", error.message)
                this.actualState = ActualState.Error
                this.messegeError = error.message
                return
            }

            if (data) {
                // Обновляем данные профиля, преобразуя дату рождения
                this.updateProfile({
                    ...this.profile,
                    name: data.name || "",
                    lastName: data.lastname || "",
                    birthDate: data.dateBirth ? this.formatDate(data.dateBirth) : "нет даты"
                })
            }

            // Получаем email текущего авторизованного пользователя
            const { data: { user }, error: userError } = await supabase.auth.getUser()

            if (userError) {
                console.error("Ошибка при получении email:", userError.message)
                this.actualState = ActualState.Error
                this.messegeError = userError.message
                return
            }

            if (user) {
                // Добавляем email к профилю
                this.updateProfile({
                    ...this.profile,
                    email: user.email || ""
                })
            }

            this.actualState = ActualState.Success
        } catch (err) {
            // Обработка любых непредвиденных ошибок
            console.error("Непредвиденная ошибка:", err)
            this.actualState = ActualState.Error
            this.messegeError = err
        }
    }

    // Загрузка профиля текущего авторизованного пользователя
    loadCurrentUserProfile = async () => {
        this.actualState = ActualState.Loading
        try {
            const response = await supabase.auth.getUser()
            const user = response?.data?.user

            if (!user) {
                console.warn("Пользователь не найден")
                this.actualState = ActualState.Error
                this.messegeError = "вы не авторизованы"
                return
            }

            // Загружаем профиль по ID текущего пользователя
            await this.loadProfile(user.id)
        } catch (error) {
            console.error("Ошибка при загрузке текущего пользователя:", error)
            this.actualState = ActualState.Error
            this.messegeError = error
        }
    }

    // Форматирование даты из строки в формат "ДД.ММ.ГГГГ"
    formatDate = (dateString) => {
        if (!dateString) return null
        const date = new Date(dateString)
        if (isNaN(date)) return null // если дата невалидная
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0') // месяцы с 0 по 11
        const year = date.getFullYear()
        return `${day}.${month}.${year}`
    }
}

// Экспорт singleton-экземпляра
export default new ProfilePageVM()