import { action, makeObservable, observable } from "mobx"
import { ActualState } from "../../Domain/States/ActualState"
import supabase from '../../Domain/Utils/Constant'
import { Profile } from "../../Domain/Models/Profile"

class ProfilePageVM{
    actualState = ActualState.Loading
    profile = new Profile()
    messegeError = "Неизветсная ошибка"
    messageSuccess = "Успех"

    constructor(){
        makeObservable(this, {
            actualState: observable,
            profile: observable,
            loadProfile: action,
            updateProfile: action
        })
    }

    updateProfile = (newState) => {
        this.profile = newState
    }

    loadProfile = async (userId) => {
    try {
      // Запрашиваем профиль из таблицы Profile
      const { data, error } = await supabase
        .from('Profile')
        .select('name, lastname, dateBirth')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Ошибка при загрузке профиля:", error.message);
        return;
      }

      if (data) {
        console.error("Ошибка при загрузке профиля:", data.lastname);
        this.updateProfile({
            ...this.profile,
            name: data.name || "",
            lastName: data.lastname || "",
            birthDate: data.dateBirth ? this.formatDate(data.dateBirth) : "нет даты"
        })
      }

      // Получаем email из текущего пользователя в auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error("Ошибка при получении email:", userError.message);
        return;
      }

      if (user) {
        this.profile.email = user.email || "";
        this.updateProfile({
            ...this.profile,
            email: user.email || ""
        })
      }
      this.actualState = ActualState.Success
    } catch (err) {
      console.error("Непредвиденная ошибка:", err);
      this.actualState = ActualState.Error
      this.messegeError = err
    }
  }

  loadCurrentUserProfile = async () => {
    this.actualState = ActualState.Loading
    try {
      const response = await supabase.auth.getUser();
      const user = response?.data?.user;

      if (!user) {
        console.warn("Пользователь не найден");
        this.actualState = ActualState.Error
        this.messegeError = "Вы не авторизированы"
        return;
      }

      await this.loadProfile(user.id);
    } catch (error) {
      console.error("Ошибка при загрузке текущего пользователя:", error);
      this.actualState = ActualState.Error
      this.messegeError = error
    }
  };

  formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date)) return null; // проверка на валидность
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // месяцы 0-11
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
}

export default new ProfilePageVM()