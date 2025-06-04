import { ActualState } from "../../Domain/States/ActualState";
import supabase from '../../Domain/Utils/Constant'
import { makeObservable, observable, action, computed } from "mobx";
import { v4 as uuidv4 } from 'uuid';

class YourPetsVM {
    actualState = ActualState.Loading
    pets = []
    beerds = []
    addState = ActualState.Init
    messegeError = ''

    constructor() {
        // Делаем поля observable и методы — actions (MobX)
        makeObservable(this, {
            actualState: observable,
            pets: observable,
            beerds: observable,
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
            this.beerds = breedsData;
            this.actualState = ActualState.Success;

            console.log('Питомцы с возрастом:', this.pets);
            console.log('Питомцы DADAD возрастом:', this.beerds);
        } catch (e) {
            console.error('Неожиданная ошибка:', e);
            this.actualState = 'Error';
            this.messegeError = e
        }
    }

    addPet = async (newPet) => {
        try {
            // Получаем пользователя
            const { data: userData, error: userError } = await supabase.auth.getUser();

            if (userError || !userData?.user?.id) {
                console.error('Ошибка получения пользователя:', userError?.message);
                this.addState = ActualState.Error;
                this.messegeError = userError?.message;
                return;
            }

            // Форматируем дату рождения
            const date = newPet.date_birth;
            const birthDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

            // Инициализируем URL фото
            let imageUrl = '';

            // Загружаем фото, если оно есть (тип Blob или File)
            if (newPet.imageFile instanceof File) {
                const fileExt = newPet.imageFile.name.split('.').pop(); // например: "jpg", "png"
                const fileName = `${uuidv4()}.${fileExt}`;
                const { data: storageData, error: uploadError } = await supabase
                    .storage
                    .from('resorse')
                    .upload(fileName, newPet.imageFile);

                if (uploadError) {
                    console.error('Ошибка загрузки изображения:', uploadError.message);
                    this.addState = ActualState.Error;
                    this.messegeError = uploadError.message;
                    return;
                }

                // Получаем публичный URL изображения
                const { data: publicUrlData } = supabase
                    .storage
                    .from('resorse')
                    .getPublicUrl(fileName);

                imageUrl = publicUrlData.publicUrl;
            }

            // Собираем данные питомца
            const petToInsert = {
                name: newPet.name,
                date_birth: birthDate,
                breed_id: newPet.breedName,
                city: newPet.city,
                image: imageUrl,
                owner: userData.user.id
            };

            // Вставляем в БД
            const { data, error } = await supabase
                .from('Pets')
                .insert([petToInsert])
                .select();

            if (error) {
                console.error('Ошибка добавления питомца:', error.message);
                this.addState = ActualState.Error;
                this.messegeError = error.message;
                return;
            }

            // Получаем имя породы
            const breedName = (await supabase
                .from('Breeds')
                .select('name')
                .eq('id', petToInsert.breed_id)
                .single()).data?.name || 'Unknown';

            // Обновляем список
            this.pets.push({ ...data[0], breedName });
            this.addState = ActualState.Init;

        } catch (e) {
            console.error('Ошибка при добавлении:', e);
            this.addState = ActualState.Error;
            this.messegeError = e.message || 'Неизвестная ошибка';
        }
    };
}

export default new YourPetsVM()