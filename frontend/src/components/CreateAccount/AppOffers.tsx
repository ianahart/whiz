import { AiOutlineCheck } from 'react-icons/ai';

const AppOffers = () => {
  return (
    <div className="create-account-app-contents">
      <h2>With Whiz you can:</h2>
      <ul>
        <li>
          <AiOutlineCheck />
          <p>Create Workspaces</p>
        </li>

        <li>
          <AiOutlineCheck />
          <p>Manage Tasks</p>
        </li>
        <li>
          <AiOutlineCheck />
          <p>Manage Productivity</p>
        </li>
        <li>
          <AiOutlineCheck />
          <p>Set Goals</p>
        </li>
        <li>
          <AiOutlineCheck />
          <p>And much more...</p>
        </li>
      </ul>
    </div>
  );
};

export default AppOffers;
