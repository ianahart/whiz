import { AxiosError } from 'axios';
import { useState } from 'react';
import { nanoid } from 'nanoid';
import { initialResetPasswordState } from '../helpers/initialState';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { http } from '../helpers/utils';
import '../styles/ResetPassword.scss';
import { IPasswords } from '../interfaces';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
const ResetPassword = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const userId = searchParams.get('uid');

  const [passwords, setPasswords] = useState(initialResetPasswordState);
  const [errors, setErrors] = useState<string[]>([]);
  const [type, setType] = useState('password');

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>, name: string) => {
    setPasswords((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name as keyof IPasswords], value: event.target.value },
    }));
  };

  const handleOnClick = async () => {
    try {
      setErrors([]);
      const response = await http.patch(`/auth/reset-password/${userId}/`, {
        token: token,
        new_password: passwords.new_password.value,
        confirm_password: passwords.confirm_password.value,
      });
      navigate('/sign-in');
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        console.log(error.response);
        if (error.response.data.errors) {
          const errors = error.response.data.errors;
          setErrors((prevState) => [...prevState, errors]);
        }
      }
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password">
        <div className="reset-password-title">
          <h2>Reset Password</h2>
          <p>Password may not be the same as old password</p>
        </div>
        <div className="reset-password-errors">
          {errors.length > 0 &&
            errors.map((error) => {
              return (
                <p key={nanoid()} className="form-error">
                  {error}
                </p>
              );
            })}
        </div>
        <div className="reset-password-inputs-container">
          <div className="reset-password-input-container">
            <label htmlFor="new_password">New Password:</label>
            <div style={{ position: 'relative' }}>
              <input
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleOnChange(event, 'new_password')
                }
                id="new_password"
                type={type}
              />
              {type === 'password' ? (
                <div onClick={() => setType('text')}>
                  <AiOutlineEyeInvisible />
                </div>
              ) : (
                <div onClick={() => setType('password')}>
                  <AiOutlineEye />
                </div>
              )}
            </div>
          </div>
          <div className="reset-password-input-container">
            <label htmlFor="confirm_password">Confirm Password:</label>
            <input
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleOnChange(event, 'confirm_password')
              }
              id="confirm_password"
              type={type}
            />
          </div>
        </div>
        <div className="reset-password-btn-container">
          <button onClick={handleOnClick}>Reset</button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
