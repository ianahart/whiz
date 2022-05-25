import Logout from '../components/Auth/Logout';
import { AxiosError } from 'axios';
import { http } from '../helpers/utils';
import { useCallback, useEffect } from 'react';

const Dashboard = () => {
  return (
    <div>
      Dashboard
      <Logout />
    </div>
  );
};

export default Dashboard;
