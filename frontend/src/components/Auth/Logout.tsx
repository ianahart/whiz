import { useEffect, useContext, useState } from 'react';
import { AxiosError } from 'axios';
import { UserContext } from '../../context/user';
import { IUserContext } from '../../interfaces';
import { http } from '../../helpers/utils';

const Logout = () => {
  const { user, tokens, logout } = useContext(UserContext) as IUserContext;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      logout();
    }
  }, [logout, isLoaded]);

  const handleOnClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await http.post('auth/logout/', {
        refresh_token: tokens.refresh_token,
        id: user.id,
      });
      setIsLoaded(true);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        console.log(error.response);
        setIsLoaded(true);
      }
    }
  };

  return (
    <div>
      <button onClick={handleOnClick}>Logout</button>
    </div>
  );
};

export default Logout;
