import { IBackground } from '../../../interfaces';

interface IBackgroundProps {
  handleSelectedBackground: (src: string) => void;
  backgrounds: IBackground[];
}

const Backgrounds = ({ backgrounds, handleSelectedBackground }: IBackgroundProps) => {
  return (
    <div className="create-dropdown-backgrounds">
      {backgrounds.map(({ id, src, thumbnail }) => {
        return (
          <img
            alt="background"
            onClick={() => handleSelectedBackground(src)}
            key={id}
            src={thumbnail}
          />
        );
      })}
    </div>
  );
};

export default Backgrounds;
