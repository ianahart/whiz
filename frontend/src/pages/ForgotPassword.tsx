import { useState } from 'react';
import { AxiosError } from 'axios';
import '../styles/ForgotPassword.scss';
import { http } from '../helpers/utils';
import Spinner from '../components/Mixed/Spinner';
import { AiOutlineCheckCircle } from 'react-icons/ai';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoaded, setIsLoaded] = useState(true);
  const [error, setError] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const sendEmail = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      event.stopPropagation();
      setIsLoaded(false);
      setError('');
      const response = await http.post('/auth/forgot-password/', { email });
      setIsLoaded(true);
      setIsSent(true);
      setEmail('');
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        setIsLoaded(true);
        if (error.response.status === 400) {
          setError(error.response.data.errors.email[0]);
        }
      }
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password">
        <div className="forgot-password-title">
          <h2>Forgot Password</h2>
          <p>
            Lost your password? Please enter your email address. You will receive a link
            to create a new password via email.
          </p>
          {isSent && (
            <div className="forgot-password-success">
              <AiOutlineCheckCircle />
              <p>Reset sent. Check your email.</p>
            </div>
          )}
        </div>
        {!isSent && (
          <div className="forgot-password-input-container">
            {error && <p className="form-error">{error}</p>}
            <label htmlFor="email">Email Address:</label>
            <input onChange={handleOnChange} value={email} type="email" id="email" />
          </div>
        )}
        {!isLoaded ? (
          <div className="forgot-password-spinner-container">
            <Spinner height="50px" width="50px" />
          </div>
        ) : (
          <div className="forgot-password-btn-container">
            {!isSent && <button onClick={sendEmail}>Send</button>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
