interface IFooterProps {
  name: string;
  year: number;
}

const Footer = ({ name, year }: IFooterProps) => {
  return (
    <div className="footer">
      <p>
        {name} &copy;{year}
      </p>
    </div>
  );
};

export default Footer;
