import { AxiosError } from 'axios';
import { useContext, useState } from 'react';
import { UserContext } from '../context/user';
import { http } from '../helpers/utils';
import { IUserContext } from '../interfaces';
import '../styles/DeleteAccount.scss';
import { retrieveTokens } from '../helpers/utils';
const DeleteAccount = () => {
  const { logout, user } = useContext(UserContext) as IUserContext;
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleOnClick = async () => {
    try {
      const tokens = retrieveTokens();
      const response = await http.delete(
        `/account/${user.id}/?token=${tokens.refresh_token}`
      );
      logout();
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        console.log(error.response);
      }
    }
  };

  return (
    <div className="delete-account-container">
      <div className="delete-account-content">
        <div className="delete-account-title">
          <h2>Delete Account</h2>
          <p>Please enter your email to confirm</p>
        </div>
        <div className="delete-account-input-container">
          <input onChange={handleOnChange} type="text" placeholder="Your email..." />
        </div>
        <div className="delete-account-btn-container">
          <button onClick={handleOnClick}>Confirm</button>
        </div>
      </div>
    </div>
  );
};
export default DeleteAccount;
