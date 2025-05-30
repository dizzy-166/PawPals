import SignInViewModel from '../pages/FormSignInSignUp/SignInVM'; // поправьте путь
import { ActualState } from '../Domain/States/ActualState';
import supabase from '../Domain/Utils/Constant';

// Мокаем supabase.auth
jest.mock('../Domain/Utils/Constant', () => ({
  auth: {
    signInWithPassword: jest.fn(),
    getUser: jest.fn(() => ({ id: 'user123', email: 'test@example.com' })),
  },
}));

describe('SignInViewModel - loagIn', () => {
  it('should login successfully and update state to Success', async () => {
    // Подготовка
    const mockUpdateUser = jest.fn();

    SignInViewModel.signInState.email = 'test@example.com';
    SignInViewModel.signInState.password = 'password123';

    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { session: 'fakeSession' },
      error: null
    });
    supabase.auth.getUser.mockResolvedValue({ id: 'user123', email: 'test@example.com' });

    // Вызов
    await SignInViewModel.loagIn(mockUpdateUser);

    // Проверка
    expect(SignInViewModel.actualState).toBe(ActualState.Success);
    expect(mockUpdateUser).toHaveBeenCalledWith({ id: 'user123', email: 'test@example.com' });
  });

  it('should handle login error and set state to Error', async () => {
    // Подготовка
    const mockUpdateUser = jest.fn();

    SignInViewModel.signInState.email = 'wrong@example.com';
    SignInViewModel.signInState.password = 'wrongPassword';

    supabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: 'Неверный email или пароль' }
    });

    // Вызов
    await SignInViewModel.loagIn(mockUpdateUser);

    // Проверка
    expect(SignInViewModel.actualState).toBe(ActualState.Error);
    expect(SignInViewModel.messegeError).toBe('Неверный email или пароль');
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });
});