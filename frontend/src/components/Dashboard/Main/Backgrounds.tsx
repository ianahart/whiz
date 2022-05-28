import { BsCheck } from 'react-icons/bs';
import { IBackground } from '../../../interfaces';

interface IBackgroundProps {
  backgrounds: IBackground[];

  handleSelectedBackground: (background: string, thumbnail: string) => void;
  selectedBackground: { background: string; thumbnail: string };
}

const Backgrounds = ({
  selectedBackground,
  backgrounds,
  handleSelectedBackground,
}: IBackgroundProps) => {
  return (
    <div className="create-dropdown-backgrounds">
      {backgrounds.map(({ id, src, thumbnail }) => {
        return (
          <div key={id} className="create-dropdown-background-container-item">
            <img
              alt="background"
              onClick={() => handleSelectedBackground(src, thumbnail)}
              key={id}
              src={thumbnail}
            />
            {src === selectedBackground.background && (
              <div className="create-dropdown-background-overlay">
                <BsCheck />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Backgrounds;
