import { Link } from 'react-router-dom';
import '../styles/Home.scss';
import '../styles/shared/Buttons.scss';
import '../styles/Particle.scss';
import Footer from '../components/Mixed/Footer';
import { useContext } from 'react';
import { UserContext } from '../context/user';
import { IUserContext } from '../interfaces';
const Home = () => {
  const { user } = useContext(UserContext) as IUserContext;
  return (
    <div>
      <nav className="home-navigation">
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
      <div className="page-bg">
        <div className="animation-wrapper">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
        </div>
      </div>
      <div className="page-wrapper">
        <h4>Whiz</h4>
      </div>
    </div>
  );
};

export default Home;
