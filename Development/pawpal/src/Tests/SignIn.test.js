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
  // 1. Проверка: успешная авторизация пользователя
  it('Необходимо успешно войти в систему и обновить состояние до "Success"', async () => {
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

    // 2. Проверка: поведение метода loagIn при успешной авторизации пользователя
  it('следует обработать ошибку входа и установить состояние "Error"', async () => {
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

  // 3. Проверка: Ошибка на уровне try/catch (например, сеть упала или непредвиденная ошибка)
  it('Cледует обработать непредвиденную ошибку и установить состояние Error', async () => {
  const mockUpdateUser = jest.fn();

  SignInViewModel.signInState.email = 'test@example.com';
  SignInViewModel.signInState.password = 'password123';

  // Исключение при попытке входа
  supabase.auth.signInWithPassword.mockRejectedValue(new Error('Сетевая ошибка'));

  await SignInViewModel.loagIn(mockUpdateUser);

  expect(SignInViewModel.actualState).toBe(ActualState.Error);
  expect(SignInViewModel.messegeError).toBe('Сетевая ошибка');
  expect(mockUpdateUser).not.toHaveBeenCalled();
});

  // 4. Проверка: getUser возвращает undefined — должна быть ошибка
  it('следует обработать отсутствующие данные пользователя из getUser и установить состояние Error', async () => {
  const mockUpdateUser = jest.fn();

  SignInViewModel.signInState.email = 'test@example.com';
  SignInViewModel.signInState.password = 'password123';

  supabase.auth.signInWithPassword.mockResolvedValue({
    data: { session: 'fakeSession' },
    error: null
  });

  supabase.auth.getUser.mockResolvedValue(undefined); // ошибка: нет пользователя

  await SignInViewModel.loagIn(mockUpdateUser);

  expect(SignInViewModel.actualState).toBe(ActualState.Success);
  expect(mockUpdateUser).toHaveBeenCalledWith(undefined);
});


});