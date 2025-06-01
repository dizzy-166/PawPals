import SignUpVM from '../pages/FormSignInSignUp/SignUpVM';
import { ActualState } from '../Domain/States/ActualState';
import supabase from '../Domain/Utils/Constant';

// Мокаем supabase
jest.mock('../Domain/Utils/Constant', () => ({
    auth: {
        signUp: jest.fn()
    },
    from: jest.fn(() => ({
        insert: jest.fn()
    }))
}));

describe('SignUpVM', () => {

    beforeEach(() => {
        // Сброс перед каждым тестом
        SignUpVM.dispose();
        jest.clearAllMocks();
    });

    // 1. Проверка: незаполненные поля
    it('Должен возвращать состояние ошибки, если обязательные поля пусты', async () => {
        SignUpVM.updateSignUpState({
            ...SignUpVM.signUpState,
            email: '',
            name: '',
            lastName: ''
        });

        await SignUpVM.regIn();

        expect(SignUpVM.actualState).toBe(ActualState.Error);
        expect(SignUpVM.messegeError).toBe('есть пустые поля');
    });

    // 2. Проверка: пароли не совпадают
    it('Должен возвращать состояние ошибки, если пароли не совпадают', async () => {
        SignUpVM.updateSignUpState({
            ...SignUpVM.signUpState,
            email: 'test@example.com',
            name: 'Иван',
            lastName: 'Иванов',
            password: '123456',
            confirmPassword: '654321'
        });

        await SignUpVM.regIn();

        expect(SignUpVM.actualState).toBe(ActualState.Error);
        expect(SignUpVM.messegeError).toBe('пароли не совпадают');
    });

    // 3. Проверка: Успешная регистрация
    it('Должен успешно завершить регистрацию при корректных данных', async () => {
    // Подготовка моков
    const mockUserId = 'user123';

    supabase.auth.signUp.mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null
    });

    supabase.from.mockReturnValue({
        insert: jest.fn().mockResolvedValue({ error: null })
    });

    // Заполнение данных формы
    SignUpVM.updateSignUpState({
        email: 'user@example.com',
        name: 'Иван',
        lastName: 'Иванов',
        password: 'password123',
        confirmPassword: 'password123',
        birthDate: '1990-01-01'
    });

    await SignUpVM.regIn();

    expect(SignUpVM.actualState).toBe(ActualState.Success);
    });

    // 4. Проверка: Ошибка при вставке профиля в таблицу
    it('Должен вернуть ошибку, если вставка в таблицу Profile завершилась неудачно', async () => {
    const mockUserId = 'user123';

    supabase.auth.signUp.mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null
    });

    supabase.from.mockReturnValue({
        insert: jest.fn().mockResolvedValue({
            error: { message: 'Ошибка вставки в профиль' }
        })
    });

    SignUpVM.updateSignUpState({
        email: 'test@example.com',
        name: 'Петр',
        lastName: 'Петров',
        password: '12345678',
        confirmPassword: '12345678',
        birthDate: '2000-12-12'
    });

    await SignUpVM.regIn();

    expect(SignUpVM.actualState).toBe(ActualState.Error);
    expect(SignUpVM.messegeError).toBe('Ошибка вставки в профиль');
});

});
