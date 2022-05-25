import { useState } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateAccount.scss';
import Input from '../components/Inputs/Input';
import AppOffers from '../components/CreateAccount/AppOffers';
import { initialRegisterFormState } from '../helpers/initialState';
import PasswordInput from '../components/Inputs/PasswordInput';
import { http } from '../helpers/utils';
import { ICreateAccountBody, ICreateAccountForm } from '../interfaces';
import Spinner from '../components/Mixed/Spinner';

const CreateAccount = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<ICreateAccountForm>(initialRegisterFormState);
  const [isLoaded, setIsLoaded] = useState(true);
  const updateFormInput = (name: string, value: string, key: string) => {
    setForm((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name as keyof ICreateAccountForm], [key]: value },
    }));
  };

  const formatName = (name: string) => {
    return name
      .split('_')
      .map((w, index) => {
        return index === 0 ? w.slice(0, 1).toUpperCase() + w.slice(1) : w;
      })
      .join(' ');
  };

  const validateField = (name: string, value: string) => {
    applyValidation(name, value);
  };

  const applyValidation = (name: string, value: string) => {
    if (value.length > 100 || value.trim().length === 0) {
      updateFormInput(
        name,
        `${formatName(name)} must be under 100 characters and may not be empty.`,
        'error'
      );
    } else {
      updateFormInput(name, '', 'error');
    }
  };

  const validateForm = () => {
    const inputObjs = Object.entries(form);
    for (const [name, inputObj] of inputObjs) {
      if (inputObj.value.length > 100 || inputObj.value.trim().length === 0) {
        updateFormInput(
          name,
          `${formatName(name)} must be under 100 characters and may not be empty.`,
          'error'
        );
        return false;
      }
    }
    return true;
  };

  const createData = () => {
    const data: any = {};
    Object.entries({ ...form })
      .map(([k, v]) => {
        return { [k]: v.value };
      })
      .forEach((field) => {
        const [k, v] = Object.entries(field)[0];
        data[k as keyof ICreateAccountBody] = v;
      });
    return data;
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsLoaded(false);
      e.preventDefault();
      if (validateForm()) {
        const data = createData();
        await http.post('auth/register/', data);
        setIsLoaded(true);
        if (isLoaded) {
          navigate('/sign-in');
        }
      } else {
        setIsLoaded(true);
      }
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 400) {
          setIsLoaded(true);
          let { errors } = error.response.data;
          errors = Object.entries(errors);
          for (const error of errors) {
            updateFormInput(error[0], error[1][0], 'error');
          }
        }
      }
    }
  };

  return (
    <div className="create-account-container">
      <section>
        <AppOffers />
        <div className="create-account-form-container">
          <form onSubmit={handleOnSubmit}>
            <h3>Create Account</h3>
            <Input
              validateField={validateField}
              updateFormInput={updateFormInput}
              htmlFor="firstName"
              label="First Name"
              id="firstName"
              name="first_name"
              type={form.first_name.type}
              error={form.first_name.error}
              value={form.first_name.value}
              placeholder={form.first_name.placeholder}
            />

            <Input
              validateField={validateField}
              updateFormInput={updateFormInput}
              htmlFor="lastName"
              label="Last Name"
              id="lastName"
              name="last_name"
              error={form.last_name.error}
              value={form.last_name.value}
              placeholder={form.last_name.placeholder}
              type={form.last_name.type}
            />

            <Input
              validateField={validateField}
              updateFormInput={updateFormInput}
              htmlFor="email"
              label="Email"
              id="email"
              name="email"
              error={form.email.error}
              value={form.email.value}
              placeholder={form.email.placeholder}
              type={form.email.type}
            />

            <PasswordInput
              validateField={validateField}
              handleUpdatePassword={updateFormInput}
              password={form.password.value}
              error={form.password.error}
              placeholder={form.password.placeholder}
              type={form.password.type}
            />
            <Input
              validateField={validateField}
              updateFormInput={updateFormInput}
              htmlFor="confirmPassword"
              label="Confirm Password"
              id="confirmPassword"
              name="confirm_password"
              error={form.confirm_password.error}
              value={form.confirm_password.value}
              placeholder={form.confirm_password.placeholder}
              type={form.confirm_password.type}
            />
            <div className="create-account-button-container">
              {isLoaded && <button type="submit">Create</button>}
              {!isLoaded && <Spinner height="120px" width="120px" />}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
export default CreateAccount;
