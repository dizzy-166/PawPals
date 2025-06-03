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
            .select('id, name, category, image, breed_id, date_birth');
        

        if (error) {
            this.actualState = ActualState.Error;
            return;
        }
        const shuffledData = [...data].sort(() => Math.random() - 0.5);
        try{
            const { data, error } = await supabase
            .from ('Breeds')
            
            .select('id, name')
            if(error){
                console.log('иди нахуй', this.breeds);
                this.actualState = ActualState.Error;
                return
            }
        this.pets = shuffledData
        
        console.log('НЕ Ошибка', data);
        if(data){
            this.breeds = data
            this.pets = this.pets.map(pet => ({
                ...pet,
                breedName: data[pet.breed_id - 1].name || 'Unknown'
              }));

              this.actualState = ActualState.Success; 
        }  
        }
        catch(e){
            this.actualState = ActualState.Error;
            console.log('иди нахуй adad', e);
        }
    });

}


export default new MainPageVM()