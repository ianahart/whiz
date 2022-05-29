import { useEffect, useContext, useState } from 'react';
import { AxiosError } from 'axios';
import { UserContext } from '../../context/user';
import { ISpaceContext, IUserContext } from '../../interfaces';
import { http } from '../../helpers/utils';
import { initialSpaceState } from '../../helpers/initialState';
import { SpaceContext } from '../../context/space';
const Logout = () => {
  const { user, tokens, logout } = useContext(UserContext) as IUserContext;
  const { setSpace, setLists } = useContext(SpaceContext) as ISpaceContext;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      logout();
    }
  }, [logout, isLoaded]);

  const handleOnClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.stopPropagation();
      await http.post('auth/logout/', {
        refresh_token: tokens.refresh_token,
        id: user.id,
      });
      setSpace(initialSpaceState);
      setLists([]);
      setIsLoaded(true);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        console.log(error.response);
        setIsLoaded(true);
      }
    }
  };

  return (
    <div className="logout-button-container">
      <button onClick={handleOnClick}>Logout</button>
    </div>
  );
};

export default Logout;
