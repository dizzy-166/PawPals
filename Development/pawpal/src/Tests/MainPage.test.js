import vm from '../pages/main/MainPageVM' // путь укажи свой
import { ActualState } from '../Domain/States/ActualState'
import supabase from '../Domain/Utils/Constant'

// Мокаем модуль supabase, чтобы перехватить вызовы к .from() и .select()
jest.mock('../Domain/Utils/Constant', () => ({
  from: jest.fn(), // .from() теперь возвращает мок-функцию
}))

// Описываем группу тестов для MainPageVM
describe('MainPageVM', () => {
  // Этот блок выполняется перед КАЖДЫМ тестом
  beforeEach(() => {
    // Сбрасываем состояние singleton VM, чтобы тесты не влияли друг на друга
    vm.pets = []
    vm.news = []
    vm.actualState = ActualState.Loading

    // Сброс моков supabase
    supabase.from.mockReset()
  })

  // Тестирует, что метод updatePet обновляет массив pets
  test('updatePet updates the pets array', () => {
    const newPets = [{ id: 1, name: 'Барсик' }] // создаём тестовые данные
    vm.updatePet(newPets) // вызываем метод
    expect(vm.pets).toEqual(newPets) // проверяем, что данные записались в VM
  })

  // Тестирует, что метод updateNews обновляет массив news
  test('updateNews updates the news array', () => {
    const newsData = [{ id: 1, name: 'Новость дня' }] // создаём тестовые данные
    vm.updateNews(newsData) // вызываем метод
    expect(vm.news).toEqual(newsData) // проверяем, что данные записались в VM
  })

  // Тестирует успешную загрузку питомцев
  test('loadPets loads pets and sets correct state', async () => {
    // Первый вызов .from('Pets')
    supabase.from
      .mockReturnValueOnce({
        select: jest.fn().mockResolvedValueOnce({
          data: [{ id: 1, name: 'Барсик', date_birth: '2020-01-01', breed_id: 2 }],
          error: null,
        }),
      })
      // Второй вызов .from('Breeds')
      .mockReturnValueOnce({
        select: jest.fn().mockResolvedValueOnce({
          data: [{ id: 2, name: 'Сфинкс' }],
          error: null,
        }),
      })

    await vm.loadPets() // вызываем метод загрузки

    expect(vm.actualState).toBe(ActualState.Success) // проверяем, что состояние стало "Success"
    expect(vm.pets.length).toBeGreaterThan(0) // убедимся, что хотя бы один питомец загружен
    expect(vm.pets[0]).toHaveProperty('age') // у питомца должен быть возраст
    expect(vm.pets[0]).toHaveProperty('breedName') // и имя породы
  })

  // Тестирует поведение при ошибке запроса Pets
  test('loadPets handles error in Pets request', async () => {
    supabase.from.mockReturnValueOnce({
      select: jest.fn().mockResolvedValueOnce({
        data: null,
        error: { message: 'Ошибка загрузки' },
      }),
    })

    await vm.loadPets()
    expect(vm.actualState).toBe('Error') // состояние должно быть Error при сбое
  })

  // Тестирует успешную загрузку новостей
  test('loadNews loads news and sets state', async () => {
    supabase.from.mockReturnValueOnce({
      select: jest.fn().mockResolvedValueOnce({
        data: [{ id: 1, name: 'Новость', description: '...' }],
        error: null,
      }),
    })

    await vm.loadNews() // вызываем метод
    expect(vm.news.length).toBe(1) // должна быть 1 новость
    expect(vm.news[0].name).toBe('Новость') // проверяем корректность данных
  })

  // Тестирует поведение при ошибке запроса news
  test('loadNews handles fetch error', async () => {
    supabase.from.mockReturnValueOnce({
      select: jest.fn().mockResolvedValueOnce({
        data: null,
        error: { message: 'Ошибка новостей' },
      }),
    })

    await vm.loadNews()
    expect(vm.actualState).toBe('Error') // при ошибке состояние должно быть Error
  })
})