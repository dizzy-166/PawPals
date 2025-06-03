import { action, makeObservable, observable } from "mobx"
import { ActualState } from "../../Domain/States/ActualState"
import supabase from '../../Domain/Utils/Constant'

// ViewModel для главной страницы сайта
class MainPageVM {
    // Дефолтное состояние странички
    actualState = ActualState.Loading
    pets = []

    messageError = "неизвестная ошибка"

    constructor() {
        // Подключаем MobX: делаем поля observable и методы actions
        makeObservable(this, {
            actualState: observable,
            pets: observable,
            loadPets: action,
            updatePet: action
        })
    }

    // Изменение текущего состояния карточки питомца
    updatePet = (newState) => {
        this.pets = newState
    }

    // Загрузка животного по petId из БД
    loadPets = action(async () => {
        const { data, error } = await supabase
            .from('Pets')
            .select('id, name, category, image');

        if (error) {
            this.actualState = ActualState.Error;
            return;
        }

        this.pets = data

        this.actualState = ActualState.Success;
    });

}


export default new MainPageVM()