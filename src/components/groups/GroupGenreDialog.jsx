import React, { useState, useContext } from 'react';

import { ButtonMain } from '../buttons';
import { LibraryContext } from '../../contexts';

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
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  const { genres, genresDialog } = libState;

  const [selected, setSelected] = useState([...genresDialog.selected]);

  const handleGenreSelected = genre => {
    setSelected(addOrRemove(selected, genre));
  };

  const handleDialogClick = e => {
    e.stopPropagation();
  };

  const handleCloseGenresDialog = () => {
    libDispatch(libActions.setGenresDialog(false));
  };

  return (
    <div
      className='genre-list-dialog-wrapper'
      onClick={handleCloseGenresDialog}
    >
      <div className='genre-list-dialog' onClick={handleDialogClick}>
        <ul className='genre-list'>
          {genres.map((genre, index) => {
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
          onClick={() => {
            genresDialog.saveCb(selected);
            handleCloseGenresDialog();
          }}
        >
          SAVE
        </ButtonMain>
      </div>
    </div>
  );
}

export default GroupGenreDialog;
