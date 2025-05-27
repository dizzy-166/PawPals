import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignIn } from '../pages/FormSignInSignUp/SignIn';
import { ActualState } from '../Domain/States/ActualState';
import { SignInVM } from '../pages/FormSignInSignUp/SignInVM';
import { Load } from '../components/Load';

// Мокаем SignInVM и его зависимости
jest.mock('../pages/FormSignInSignUp/SignInVM', () => {
  const ActualState = {
    Init: 'Init',
    Loading: 'Loading',
    Error: 'Error',
    Success: 'Success'
  };
  
  return {
    SignInVM: {
      actualState: ActualState.Init,
      signInState: {
        email: '',
        password: ''
      },
      messageError: '',
      updateSignInState: jest.fn(),
      loagIn: jest.fn(),
      dispose: jest.fn()
    },
    ActualState // Добавляем ActualState в экспорт
  };
});

// Мокаем компонент Load
jest.mock('../components/Load', () => ({
  Load: () => <div>Loading...</div>,
}));

describe('SignIn Component', () => {
  const mockSetShowing = jest.fn();
  const mockOnToggleAuth = jest.fn();
  const mockUpdateUser = jest.fn();

  beforeEach(() => {
    // Сбрасываем моки перед каждым тестом
    jest.clearAllMocks();
    // Возвращаем начальное состояние
    SignInVM.actualState = ActualState.Init;
    SignInVM.signInState = { email: '', password: '' };
    SignInVM.messegeError = '';
  });

  test('renders correctly in Init state', () => {
    render(
      <SignIn 
        setShowing={mockSetShowing} 
        onToggleAuth={mockOnToggleAuth} 
        updateUser={mockUpdateUser} 
      />
    );
    
    expect(screen.getByText('Не узнаем ваши лапки')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Логин или Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument();
    expect(screen.getByText('Войти')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
  });

  test('updates email and password fields', () => {
    render(
      <SignIn 
        setShowing={mockSetShowing} 
        onToggleAuth={mockOnToggleAuth} 
        updateUser={mockUpdateUser} 
      />
    );
    
    const emailInput = screen.getByPlaceholderText('Логин или Email');
    const passwordInput = screen.getByPlaceholderText('Пароль');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(SignInVM.updateSignInState).toHaveBeenCalledWith({
      ...SignInVM.signInState,
      email: 'test@example.com',
    });
    expect(SignInVM.updateSignInState).toHaveBeenCalledWith({
      ...SignInVM.signInState,
      password: 'password123',
    });
  });

  test('calls loagIn on button click', () => {
    render(
      <SignIn 
        setShowing={mockSetShowing} 
        onToggleAuth={mockOnToggleAuth} 
        updateUser={mockUpdateUser} 
      />
    );
    
    fireEvent.click(screen.getByText('Войти'));
    expect(SignInVM.loagIn).toHaveBeenCalledWith(mockUpdateUser);
  });

  test('shows loading state', () => {
    SignInVM.actualState = ActualState.Loading;
    render(
      <SignIn 
        setShowing={mockSetShowing} 
        onToggleAuth={mockOnToggleAuth} 
        updateUser={mockUpdateUser} 
      />
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Войти')).not.toBeInTheDocument();
  });

  test('shows error state with message', () => {
    SignInVM.actualState = ActualState.Error;
    SignInVM.messegeError = 'Invalid credentials';
    render(
      <SignIn 
        setShowing={mockSetShowing} 
        onToggleAuth={mockOnToggleAuth} 
        updateUser={mockUpdateUser} 
      />
    );
    
    expect(screen.getByText('Войти')).toBeInTheDocument();
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  test('calls setShowing and dispose on Success state', () => {
    SignInVM.actualState = ActualState.Success;
    render(
      <SignIn 
        setShowing={mockSetShowing} 
        onToggleAuth={mockOnToggleAuth} 
        updateUser={mockUpdateUser} 
      />
    );
    
    expect(mockSetShowing).toHaveBeenCalledWith(false);
    expect(SignInVM.dispose).toHaveBeenCalled();
  });

  test('switches to SignUp when "Создать" is clicked', () => {
    render(
      <SignIn 
        setShowing={mockSetShowing} 
        onToggleAuth={mockOnToggleAuth} 
        updateUser={mockUpdateUser} 
      />
    );
    
    const createAccountLink = screen.getByText('Создать');
    fireEvent.click(createAccountLink);

    expect(mockOnToggleAuth).toHaveBeenCalledWith(false);
  });
});