import { ActualState } from "../../Domain/States/ActualState";
import supabase from '../../Domain/Utils/Constant'
import { makeObservable, observable, action, computed } from "mobx";


class YourPetsVM{
    actualState = ActualState.Loading
    pets = []
    addState = ActualState.Init
    messegeError = ''

    constructor() {
            // Делаем поля observable и методы — actions (MobX)
            makeObservable(this, {
                actualState: observable,
                pets: observable,
                addState: observable,
                messegeError: observable,
                loadPets: action
            })
        }

    loadPets = async () => {
        try {
            const user = await supabase.auth.getUser()
            console.log('Юзер:', user.id);
            const { data: petsData, error: petsError } = await supabase
            .from('Pets')
            .select('id, name, image, breed_id, date_birth, city, owner')
            .eq('owner', user.data.user.id);

            if (petsError) {
                console.error('Ошибка при загрузке питомцев:', petsError.message);
                this.actualState = 'Error';
                this.messegeError = petsError.message
                return;
            }

            const shuffledData = [...petsData].sort(() => Math.random() - 0.5);

            const { data: breedsData, error: breedsError } = await supabase
                .from('Breeds')
                .select('id, name');

            if (breedsError) {
                console.error('Ошибка при загрузке пород:', breedsError.message);
                this.actualState = 'Error';
                this.messegeError = breedsError.message
                return;
            }

            // Преобразуем дату рождения в возраст
            const petsWithAge = shuffledData.map(pet => {
                return {
                    ...pet,
                    breedName: breedsData.find(b => b.id === pet.breed_id)?.name || 'Unknown'
                };
            });

            this.pets = petsWithAge;
            this.actualState = ActualState.Success;

            console.log('Питомцы с возрастом:', this.pets);
        } catch (e) {
            console.error('Неожиданная ошибка:', e);
            this.actualState = 'Error';
            this.messegeError = e
        }
    }

    addPet = async (newPet) => {
    try {
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData?.user?.id) {
            console.error('Ошибка получения пользователя:', userError?.message);
            this.addState = ActualState.Error;
            this.messegeError = userError?.message
            return;
        }

        const petToInsert = {
            name: newPet.name,
            date_birth: newPet.date_birth,
            breed_id: newPet.breed_id, // breed_id должен быть числом
            city: newPet.city,
            image: newPet.image || '', // можно оставить пустым
            owner: userData.user.id
        };

        const { data, error } = await supabase
            .from('Pets')
            .insert([petToInsert])
            .select(); // получим вставленную строку обратно

        if (error) {
            console.error('Ошибка добавления питомца:', error.message);
            this.addState = 'Error';
            this.messegeError = error.message
            return;
        }

        // Получаем название породы по breed_id
        const breedName = (await supabase
            .from('Breeds')
            .select('name')
            .eq('id', petToInsert.breed_id)
            .single()).data?.name || 'Unknown';

        // Добавляем в локальный список
        this.pets.push({ ...data[0], breedName });
        this.addState = ActualState.Success;
    } catch (e) {
        console.error('Ошибка при добавлении:', e);
        this.addState = ActualState.Error;
        this.messegeError = e 
    }
}
}

export default new YourPetsVM()