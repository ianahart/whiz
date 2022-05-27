import { BsCheck } from 'react-icons/bs';
import { IBackground } from '../../../interfaces';

interface IBackgroundProps {
  handleSelectedBackground: (src: string) => void;
  backgrounds: IBackground[];
  selectedBackground: string;
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
              onClick={() => handleSelectedBackground(src)}
              key={id}
              src={thumbnail}
            />
            {src === selectedBackground && (
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
