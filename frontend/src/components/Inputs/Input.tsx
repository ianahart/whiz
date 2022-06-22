import '../../styles/shared/Mixed.scss';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

interface IInputProps {
  updateFormInput: (name: string, value: string, key: string) => void;
  validateField: (name: string, value: string) => void;
  htmlFor: string;
  label: string;
  id: string;
  name: string;
  type: string;
  error: string;
  value: string;
  placeholder: string;
}

const Input = ({
  updateFormInput,
  validateField,
  htmlFor,
  label,
  id,
  name,
  value,
  type,
  error,
  placeholder,
}: IInputProps) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    updateFormInput(e.target.name, e.target.value, 'value');
  };

  const handleOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (type === 'text') {
      updateFormInput('password', 'password', 'type');
      updateFormInput('confirm_password', 'password', 'type');
      return;
    }
    updateFormInput('confirm_password', 'text', 'type');
    updateFormInput('password', 'text', 'type');
  };

  return (
    <>
      <div className="form-control">
        <label htmlFor={htmlFor}>{label}:</label>
        {name === 'password' && (
          <div className="password-visibility" onClick={handleOnClick}>
            {type === 'text' ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
          </div>
        )}
        <input
          type={type}
          autoComplete="true"
          onBlur={() => validateField(name, value)}
          onChange={handleOnChange}
          id={id}
          name={name}
          placeholder={`${placeholder}...`}
        />
      </div>

      {error.length > 0 && <p className="form-error">{error}</p>}
    </>
  );
};

export default Input;
