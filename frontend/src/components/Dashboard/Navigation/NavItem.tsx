import { BsChevronDown } from 'react-icons/bs';

interface INavItemProps {
  label: string;
}

const NavItem = ({ label }: INavItemProps) => {
  return (
    <li>
      <div>
        <p>{label}</p>
        <BsChevronDown />
      </div>
    </li>
  );
};
export default NavItem;
