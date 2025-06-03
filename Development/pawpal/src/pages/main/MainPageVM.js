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
    loadPets = async () => {
    try {
        const { data: petsData, error: petsError } = await supabase
            .from('Pets')
            .select('id, name, category, image, breed_id, date_birth');

        if (petsError) {
            console.error('Ошибка при загрузке питомцев:', petsError.message);
            this.actualState = 'Error';
            return;
        }

        const shuffledData = [...petsData].sort(() => Math.random() - 0.5);

        const { data: breedsData, error: breedsError } = await supabase
            .from('Breeds')
            .select('id, name');

        if (breedsError) {
            console.error('Ошибка при загрузке пород:', breedsError.message);
            this.actualState = 'Error';
            return;
        }

        // Преобразуем дату рождения в возраст
        const petsWithAge = shuffledData.map(pet => {
            const birthDate = new Date(pet.date_birth);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            return {
                ...pet,
                age,
                breedName: breedsData.find(b => b.id === pet.breed_id)?.name || 'Unknown'
            };
        });

        this.pets = petsWithAge;
        this.breeds = breedsData;
        this.actualState = 'Success';

        console.log('Питомцы с возрастом:', this.pets);
    } catch (e) {
        console.error('Неожиданная ошибка:', e);
        this.actualState = 'Error';
    }
}

}


export default new MainPageVM()