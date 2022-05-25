import { useState } from 'react';
import Input from './Input';

interface IPasswordInputProps {
  handleUpdatePassword: (name: string, value: string, key: string) => void;
  validateField: (name: string, value: string) => void;
  password: string;
  error: string;
  placeholder: string;
  type: string;
}

const PasswordInput = ({
  handleUpdatePassword,
  validateField,
  password,
  error,
  placeholder,
  type,
}: IPasswordInputProps) => {
  const [passwordStrength, setPasswordStrength] = useState('');
  const meter = {
    '': '0%',
    weak: '25%',
    poor: '50%',
    strong: '75%',
    'very strong': '100%',
  };

  const updatePassword = (name: string, value: string, key: string) => {
    handleUpdatePassword(name, value, key);

    const specialChars = `\`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`;
    if (value.trim().length === 0) {
      setPasswordStrength('');
    } else if (value.trim().length > 0 && value.trim().length < 4) {
      setPasswordStrength('weak');
    } else if (value.trim().length > 5 && value.trim().length < 8) {
      setPasswordStrength('poor');
    } else if (value.trim().length > 9 && value.trim().length < 14) {
      setPasswordStrength('strong');
    } else if (
      specialChars
        .split('')
        .some((char) => value.includes(char) && value.trim().length >= 14)
    ) {
      setPasswordStrength('very strong');
    }
  };

  return (
    <>
      <div>
        <Input
          validateField={validateField}
          updateFormInput={updatePassword}
          htmlFor="password"
          label="password"
          id="password"
          name="password"
          type={type}
          error={error}
          value={password}
          placeholder={placeholder}
        />
      </div>
      {passwordStrength.length > 0 && (
        <div className="password-strength-container">
          <div
            style={{
              width: meter[passwordStrength as keyof typeof meter],
              background: '#20c520',
            }}
            className="password-strength-inner"
          ></div>
        </div>
      )}
      <p className="password-strength-meter">{passwordStrength}</p>
    </>
  );
};
export default PasswordInput;
