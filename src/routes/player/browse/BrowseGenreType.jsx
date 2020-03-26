import React from 'react';

function BrowseGenreType(props) {
  const data = {
    genre: { id: 'r-acoustic', name: 'Acoustic' },
    data: {}
  };

  return (
    <div className='browse-genre-type content-page fadein'>
      <div className='browse-header'>
        <span className='font-short-extra font-weight-bold font-white'>
          {data.genre.name}
        </span>
      </div>
      <div className='mono-page genre-content'></div>
    </div>
  );
}

export default BrowseGenreType;
