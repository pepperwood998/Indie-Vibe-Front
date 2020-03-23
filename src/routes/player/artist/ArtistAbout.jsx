import React from 'react';

function ArtistAbout(props) {
  const { artist } = props;

  return (
    <div className='body__bound fadein'>
      <p className='font-short-big font-white'>{artist.biography}</p>
    </div>
  );
}

export default ArtistAbout;
