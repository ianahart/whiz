import spinner from '../../images/spinner.png';

export interface ISpinnerProps {
  width: string;
  height: string;
}

const Spinner = ({ width, height }: ISpinnerProps) => {
  return <img style={{ width, height }} src={spinner} alt="animated spinner" />;
};

export default Spinner;
