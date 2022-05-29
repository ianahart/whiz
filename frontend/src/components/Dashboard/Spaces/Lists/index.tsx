import { AxiosError } from 'axios';
import { useContext, useState, useEffect, useCallback } from 'react';
import { SpaceContext } from '../../../../context/space';
import { http } from '../../../../helpers/utils';
import { ISpaceContext } from '../../../../interfaces';
import List from './List';
import '../../../../styles/List.scss';

const Lists = () => {
  const { space, lists } = useContext(SpaceContext) as ISpaceContext;
  const [error, setError] = useState('');

  return (
    <div className="lists-container overflow-scroll">
      {lists.map((list) => {
        return <List key={list.id} list={list} />;
      })}
    </div>
  );
};

export default Lists;
