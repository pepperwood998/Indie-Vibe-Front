import React, { useState, useEffect, useContext } from 'react';
import { CollectionGenres } from '../../../components/collections';
import { AuthContext } from '../../../contexts';
import { getGenresList } from '../../../apis/API';

function Genres(props) {
  const { state: authState } = useContext(AuthContext);

  const [genres, setGenres] = useState([]);

  useEffect(() => {
    getGenresList(authState.token)
      .then(response => response.json())
      .then(res => {
        if (res.status === 'success') {
          setGenres(res.data);
        }
      });
  }, []);

  return (
    <div className='browse-genres fadein'>
      <CollectionGenres header='All genres' items={genres} />
    </div>
  );
}

export default Genres;
