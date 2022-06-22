export interface CardDescriptionProps {
  desc: string;
  error: string;
  descIsOpen: boolean;
  update: (event: React.MouseEvent<HTMLButtonElement>) => void;
  cancelDesc: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleDescIsOpen: (bool: boolean) => void;
  handleDescOnChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const CardDescription = ({
  update,
  cancelDesc,
  handleDescIsOpen,
  handleDescOnChange,
  descIsOpen,
  desc,
  error,
}: CardDescriptionProps) => {
  return (
    <div className="card-details-description">
      {error && <p className="form-error">{error}</p>}
      {!descIsOpen ? (
        <div
          onClick={() => handleDescIsOpen(true)}
          className="card-details-description-set"
        >
          {desc ? desc : 'Write a description...'}
        </div>
      ) : (
        <div className="card-details-description-unset">
          <textarea
            value={desc}
            onChange={handleDescOnChange}
            placeholder="Add a description..."
          ></textarea>
          <div className="card-details-description-btn-container">
            <button onClick={update}>Save</button>
            <button onClick={cancelDesc}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardDescription;
