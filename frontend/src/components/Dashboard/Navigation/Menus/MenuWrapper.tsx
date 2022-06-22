import Spaces from './Spaces';
import Starred from './Starred';
import Recent from './Recent';
import Create from './Create';
const MenuWrapper = () => {
  return (
    <ul>
      <Spaces />
      <Starred />
      <Recent />
      <Create />
    </ul>
  );
};

export default MenuWrapper;
