import { Link } from 'react-router-dom';
import '../styles/Home.scss';
import '../styles/shared/Buttons.scss';
import Footer from '../components/Mixed/Footer';
import { useContext } from 'react';
import { UserContext } from '../context/user';
import { IUserContext } from '../interfaces';
const Home = () => {
  const { user } = useContext(UserContext) as IUserContext;
  return (
    <div className="home-container">
      <nav className="home-navigation">
        <header>
          <h1>Whiz</h1>
        </header>
        {!user.logged_in && (
          <ul>
            <li>
              <Link to="/sign-in" className="link-button button-gradient">
                Sign in
              </Link>
            </li>
            <li>
              <Link className="link-button" to="/sign-up">
                Sign up
              </Link>
            </li>
          </ul>
        )}
      </nav>
      <div className="site-content">
        <p>Home</p>
      </div>
      <Footer name="ShredBuddy" year={2022} />
    </div>
  );
};

export default Home;
