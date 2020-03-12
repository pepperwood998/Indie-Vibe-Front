import React, { useState } from 'react';

import { ButtonMain } from '../buttons';

const addOrRemove = (array, genre) => {
  const exists = array.some(g => genre.id === g.id);

  if (exists) {
    return array.filter(g => {
      return genre.id !== g.id;
    });
  } else {
    return [...array, genre];
  }
};
function GroupGenreDialog(props) {
  const { items, handleGenreDialogSaved, handleGenreDialogClosed } = props;
  const [selected, setSelected] = useState([...props.selected]);

  const handleGenreSelected = genre => {
    setSelected(addOrRemove(selected, genre));
  };

  const handleDialogClick = e => {
    e.stopPropagation();
  };

  return (
    <div
      className='genre-list-dialog-wrapper'
      onClick={handleGenreDialogClosed}
    >
      <div className='genre-list-dialog' onClick={handleDialogClick}>
        <ul className='genre-list'>
          {items.map((genre, index) => {
            let classes = 'genre-item font-short-regular font-weight-bold';
            if (selected.some(g => genre.id === g.id)) {
              classes += ' selected';
            }

            return (
              <li
                key={index}
                className={classes}
                onClick={() => {
                  handleGenreSelected(genre);
                }}
              >
                {genre.name}
              </li>
            );
          })}
        </ul>
        <ButtonMain
          className='mt-2 float-right'
          isFitted={true}
          onClick={() => {
            handleGenreDialogSaved(selected);
          }}
        >
          SAVE
        </ButtonMain>
      </div>
    </div>
  );
}

export default GroupGenreDialog;
