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
    it('should return error state if required fields are empty', async () => {
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
    it('should return error state if passwords do not match', async () => {
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

});
