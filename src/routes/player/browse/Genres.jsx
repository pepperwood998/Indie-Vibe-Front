import React, { useState, useEffect, useContext } from 'react';
import { CollectionGenres } from '../../../components/collections';
import { AuthContext } from '../../../contexts';
import { getGenresList } from '../../../apis/API';
import GroupEmpty from '../../../components/groups/GroupEmpty';

function Genres(props) {
  const { state: authState } = useContext(AuthContext);

  const [firstRender, setFirstRender] = useState(true);
  const [genres, setGenres] = useState([]);

  const isEmpty = !genres.length;

  useEffect(() => {
    getGenresList(authState.token)
      .then(response => response.json())
      .then(res => {
        setFirstRender(false);
        if (res.status === 'success') {
          setGenres(res.data);
        }
      });
  }, []);

  return firstRender ? (
    ''
  ) : (
    <GroupEmpty isEmpty={isEmpty} message='No genres available'>
      <div className='browse-genres content-padding fadein'>
        <CollectionGenres header='All genres' items={genres} />
      </div>
    </GroupEmpty>
  );
}

export default Genres;
