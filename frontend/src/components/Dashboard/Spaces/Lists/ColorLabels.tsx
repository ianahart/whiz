import { useRef, useCallback, useEffect } from 'react';

import { AiOutlineClose } from 'react-icons/ai';
import { BsFillPencilFill } from 'react-icons/bs';
import { colors } from '../../../../helpers/initialState';

export interface IColorLabelsProps {
  closeColorLabel: () => void;
  handleSetLabel: (color: string, value: string) => void;
  hasButton: boolean;
  changeLabel: () => void;
}

const ColorLabels = ({
  hasButton,
  handleSetLabel,
  changeLabel,
  closeColorLabel,
}: IColorLabelsProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>, color: string) => {
    handleSetLabel(color, event.target.value);
  };

  const handleOnClick = (event: React.MouseEvent<HTMLInputElement>, color: string) => {
    event.stopPropagation();
    handleSetLabel(color, '');
  };
  const handleClickAway = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      const target = event.target as Element;
      if (menuRef.current !== null) {
        if (!menuRef.current.contains(target)) {
          closeColorLabel();
        }
      }
    },
    [closeColorLabel]
  );

  useEffect(() => {
    window.addEventListener('click', handleClickAway);
    return () => window.removeEventListener('click', handleClickAway);
  }, [handleClickAway]);

  return (
    <div ref={menuRef} className="list-card-color-labels-container">
      <div className="list-card-color-labels-header">
        <p>Color Labels</p>
        <div onClick={closeColorLabel}>
          <AiOutlineClose />
        </div>
      </div>
      <div className="list-card-color-labels">
        {colors.map((color) => {
          return (
            <div key={color.id} className="list-card-color-column">
              <input
                onClick={(e) => handleOnClick(e, color.color)}
                onChange={(e) => handleOnChange(e, color.color)}
                type="text"
                style={{ background: color.color }}
              />
              <div>
                <BsFillPencilFill />
              </div>
            </div>
          );
        })}

        {hasButton && (
          <button onClick={changeLabel} className="color-label-button">
            select
          </button>
        )}
      </div>
    </div>
  );
};

export default ColorLabels;
