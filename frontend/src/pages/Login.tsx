import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import '../styles/Login.scss';
import '../styles/shared/Buttons.scss';
import { ILoginForm, IUserContext } from '../interfaces';
import Input from '../components/Inputs/Input';
import { initialLoginFormState } from '../helpers/initialState';
import { http, namePath } from '../helpers/utils';
import { UserContext } from '../context/user';
import { ILoginResponse } from '../interfaces/response';
const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialLoginFormState);
  const [backendError, setBackendError] = useState('');
  const { setUser, syncTokens, user } = useContext(UserContext) as IUserContext;

  const validateField = (name: string, value: string) => {
    setBackendError('');
    if (value.trim().length === 0) {
      setForm((prevState) => ({
        ...prevState,
        [name]: {
          ...prevState[name as keyof ILoginForm],
          error: `${name} may not be empty.`,
        },
      }));
    }
  };

  const updateFormInput = (name: string, value: string, key: string) => {
    if (name === 'confirm_password') return;
    setForm((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name as keyof ILoginForm], [key]: value },
    }));
  };

  const applyServerErrors = <T extends object>(errors: T) => {
    const errs = Object.entries(errors);
    for (const [k, v] of errs) {
      updateFormInput(k, v, 'error');
    }
  };
  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const response = await http.post<ILoginResponse>('auth/login/', {
        email: form.email.value,
        password: form.password.value,
      });

      setUser(response.data.user);
      localStorage.setItem('tokens', JSON.stringify(response.data.tokens));
      syncTokens(response.data.tokens);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 400) {
          let { errors } = error.response.data;
          applyServerErrors(errors);
        } else {
          setBackendError(error.response.data.errors);
        }
      }
    }
  };

  useEffect(() => {
    if (user.full_name.length) {
      const name = namePath(user.full_name);
      if (name) {
        navigate(`/${name}`);
      }
    }
  }, [navigate, user.full_name]);

  return (
    <div className="login-container">
      <form onSubmit={handleOnSubmit} className="login-form">
        <header>
          <h2>Log In</h2>
          <Link to="/sign-up">Need an account? Sign Up</Link>
          {backendError && <p className="form-error">{backendError}</p>}
        </header>
        <div className="login-input-container">
          <Input
            validateField={validateField}
            updateFormInput={updateFormInput}
            htmlFor="email"
            label="Your Email"
            id="email"
            name="email"
            type={form.email.type}
            error={form.email.error}
            value={form.email.value}
            placeholder={form.email.placeholder}
          />
        </div>
        <div className="login-input-container">
          <Input
            validateField={validateField}
            updateFormInput={updateFormInput}
            htmlFor="password"
            label="Your Password"
            id="password"
            name="password"
            type={form.password.type}
            error={form.password.error}
            value={form.password.value}
            placeholder={form.password.placeholder}
          />
        </div>
        <div className="login-forgot-password">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <div className="login-button-container">
          <button className="button" type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
