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
            loadPets: action,
            updatePets: action,
            deletePet: action
        })
    }

    updatePets = (newState, id) => {
        const index = this.pets.findIndex(p => p.id === id);
        const newd = this.pets
        if (true) {
            newd[index] = newState;
            this.pets = newd
            console.log('Залупа такая: ', this.pets[2])
            console.log('И такая: ', newState)
        }
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

    updatePet = async (newPet, id) => {
        try {
            if (!id) {
                alert('Отсутствует ID питомца для обновления.');
                return
            }

            // Форматируем дату
            const date = newPet.date_birth;
            const birthDate = newPet.date_birth;
            try {
                birthDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            }
            catch {

            }
            finally {
                // Загружаем новое изображение, если выбрано
                let imageUrl = newPet.image; // старое изображение по умолчанию

                if (newPet.imageFile instanceof File) {
                    const fileExt = newPet.imageFile.name.split('.').pop();
                    const fileName = `${uuidv4()}.${fileExt}`;

                    const { error: uploadError } = await supabase
                        .storage
                        .from('resorse')
                        .upload(fileName, newPet.imageFile);

                    if (uploadError) {
                        console.error('Ошибка загрузки изображения:', uploadError.message);
                        this.addState = ActualState.Error;
                        this.messegeError = uploadError.message;
                        alert(uploadError.message);
                        return;
                    }

                    const { data: publicUrlData } = supabase
                        .storage
                        .from('resorse')
                        .getPublicUrl(fileName);

                    imageUrl = publicUrlData.publicUrl;
                }

                if (typeof newPet.breedName === 'number') {
                    // Обновляем запись
                    const { error: updateError } = await supabase
                        .from('Pets')
                        .update({
                            name: newPet.name,
                            date_birth: birthDate,
                            breed_id: newPet.breedName,
                            city: newPet.city,
                            image: imageUrl
                        })
                        .eq('id', id);
                    if (updateError) {
                        console.error('Ошибка обновления питомца:', updateError.message);
                        this.addState = ActualState.Error;
                        this.messegeError = updateError.message;
                        return;
                    }
                }
                else {
                    const { error: updateError } = await supabase
                        .from('Pets')
                        .update({
                            name: newPet.name,
                            date_birth: birthDate,
                            city: newPet.city,
                            image: imageUrl
                        })
                        .eq('id', id);
                    if (updateError) {
                        console.error('Ошибка обновления питомца:', updateError.message);
                        this.addState = ActualState.Error;
                        this.messegeError = updateError.message;
                        return;
                    }
                }



                // Обновляем локальные данные (опционально)
                const updatedPet = {
                    ...newPet,
                    image: imageUrl,
                    breed_id: newPet.breedName
                };
                const breedNameData = await supabase
                    .from('Breeds')
                    .select('name')
                    .eq('id', updatedPet.breed_id)
                    .single();

                updatedPet.breedName = breedNameData.data?.name || 'Unknown';

                // Заменим в списке
                this.pets = this.pets.map(p => p.id === updatedPet.id ? updatedPet : p);
                this.addState = ActualState.Success;
                alert('Данные были обновлены');
            }

        } catch (e) {
            console.error('Ошибка при обновлении:', e);
            this.addState = ActualState.Error;
            this.messegeError = e.message || 'Неизвестная ошибка';
            alert(e.message);
        }
    };

    deletePet = async (id) => {
        try {
            if (!id) {
                alert('Отсутствует ID питомца для удаления');
                return;
            }

            // 1. Удаляем запись из базы данных
            const { error: deleteError } = await supabase
                .from('Pets')
                .delete()
                .eq('id', id);

            if (deleteError) {
                console.error('Ошибка удаления питомца:', deleteError.message);
                this.addState = ActualState.Error;
                this.messegeError = deleteError.message;
                alert(deleteError.message);
                return;
            }

            // 2. Удаляем изображение из хранилища (если нужно)
            // (Добавьте эту часть, если хотите удалять файлы)
            /*
            if (pet.image) {
              const fileName = pet.image.split('/').pop();
              await supabase.storage.from('resorse').remove([fileName]);
            }
            */

            // 3. Обновляем локальный список
            this.pets = this.pets.filter(pet => pet.id !== id);

            this.addState = ActualState.Success;
            alert('Питомец успешно удален');

        } catch (e) {
            console.error('Ошибка при удалении:', e);
            this.addState = ActualState.Error;
            this.messegeError = e.message || 'Неизвестная ошибка';
            alert(e.message);
        }
    };
}

export default new YourPetsVM()