import { Link } from 'react-router-dom';
import '../styles/Home.scss';
import '../styles/shared/Buttons.scss';
import Footer from '../components/Mixed/Footer';
const Home = () => {
  return (
    <div className="home-container">
      <nav className="home-navigation">
        <header>
          <h1>Whiz</h1>
        </header>
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
      </nav>
      <div className="site-content">
        <p>Home</p>
      </div>
      <Footer name="ShredBuddy" year={2022} />
    </div>
  );
};

export default Home;
