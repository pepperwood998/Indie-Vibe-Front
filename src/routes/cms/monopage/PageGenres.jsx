import React, { useContext, useEffect, useRef, useState } from 'react';
import { getGenresList } from '../../../apis/API';
import {
  addGenre,
  editGenre,
  getGenre,
  deleteGenre
} from '../../../apis/APICms';
import Placeholder from '../../../assets/imgs/placeholder.png';
import { AddIcon } from '../../../assets/svgs';
import { InputFileLabel } from '../../../components/inputs';
import { AuthContext, LibraryContext } from '../../../contexts';
import { isMissing } from '../../../utils/Common';
import { ButtonRegular } from '../components/buttons';
import { InputTextRegular } from '../components/inputs';

function GenresMgmt() {
  const { state: authState } = useContext(AuthContext);
  const { actions: libActions, dispatch: libDispatch } = useContext(
    LibraryContext
  );

  const [genres, setGenres] = useState([]);
  const [selected, setSelected] = useState(-1);

  useEffect(() => {
    getGenresList(authState.token)
      .then(res => {
        if (res.status === 'success') {
          setGenres(res.data);
        } else throw res.data;
      })
      .catch(err => {
        if (typeof err !== 'string') {
          err = 'Failed to load genres';
        }

        libDispatch(libActions.setNotification(true, false, err));
      });
  }, []);

  const handleAddSuccess = id => {
    getGenre(authState.token, id)
      .then(res => {
        if (res.status === 'success') {
          setGenres([...genres, { ...res.data }]);
        } else throw res.data;
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleUpdateGenre = id => {
    getGenre(authState.token, id)
      .then(res => {
        if (res.status === 'success') {
          const genresTmp = [...genres];
          genresTmp[genresTmp.findIndex(g => g.id === id)] = { ...res.data };
          setGenres([...genresTmp]);
        } else throw res.data;
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleDeleteGenre = id => {
    setGenres(genres.filter(g => g.id !== id));
    setSelected(-1);
  };

  return (
    <div className='mono-page-wrapper'>
      <div className='mono-page page-genres fadein d-flex padder'>
        <section className='flex-1 boxy catalog-menu mr-3'>
          <div className='header clearfix'>
            <span className='font-short-big'>List of Genres</span>
            <AddIcon
              className='svg--gray-light svg--cursor float-right svg--scale'
              onClick={() => {
                setSelected(-1);
              }}
            />
          </div>
          <div className='content'>
            <div className='genres-list'>
              <div className='custom-grid justify-items-off three-cols'>
                {genres.map((genre, index) => (
                  <div key={index} className='card-simple'>
                    <div
                      className='link'
                      onClick={() => {
                        setSelected(index);
                      }}
                    >
                      <div className='background'>
                        <img
                          className='background__img'
                          src={genre.thumbnail ? genre.thumbnail : Placeholder}
                        />
                        <div className='background__layer'></div>
                      </div>
                      <div className='title font-short-extra font-weight-bold font-white'>
                        {genre.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className='flex-1 boxy catalog-menu'>
          <div className='header'>
            <span className='font-short-big'>Add or Edit Genre</span>
          </div>
          <div className='content'>
            {selected >= 0 ? (
              <EditGenre
                genre={genres[selected]}
                handleUpdateGenre={handleUpdateGenre}
                handleDeleteGenre={handleDeleteGenre}
              />
            ) : (
              <AddGenre handleAddSuccess={handleAddSuccess} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function AddGenre({ handleAddSuccess = id => {} }) {
  const { state: authState } = useContext(AuthContext);
  const { actions: libActions, dispatch: libDispatch } = useContext(
    LibraryContext
  );

  const [genre, setGenre] = useState({
    name: '',
    description: '',
    thumbnail: null
  });
  const [submitted, setSubmitted] = useState(false);
  const [adding, setAdding] = useState(false);
  const handleSubmit = () => {
    setSubmitted(true);
    if (!genre.name || !genre.thumbnail) return;

    setAdding(true);
    addGenre(authState.token, genre)
      .then(res => {
        if (res.status === 'success') {
          setAdding(false);
          handleAddSuccess(res.data);
          libDispatch(libActions.setNotification(true, true, 'Genre Added'));
        } else throw res.data;
      })
      .catch(err => {
        setAdding(false);
        if (typeof err !== 'string') {
          err = 'Failed to add genre';
        }

        libDispatch(libActions.setNotification(true, false, err));
      });
  };

  return (
    <div>
      <GenreForm
        genre={genre}
        handleChangeInfo={e => {
          const target = e.target;
          setGenre({ ...genre, [target.getAttribute('name')]: target.value });
        }}
        handleChangeThumbnail={thumbnail => {
          setGenre({ ...genre, thumbnail });
        }}
        submitted={submitted}
      />
      <div className='mt-2 clearfix'>
        <ButtonRegular
          className='float-right'
          disabled={adding}
          onClick={handleSubmit}
        >
          ADD
        </ButtonRegular>
      </div>
    </div>
  );
}

function EditGenre({
  genre = {},
  handleUpdateGenre = id => {},
  handleDeleteGenre = id => {}
}) {
  const { state: authState } = useContext(AuthContext);
  const { actions: libActions, dispatch: libDispatch } = useContext(
    LibraryContext
  );

  const [data, setData] = useState({
    name: [false, ''],
    description: [false, ''],
    thumbnail: [false, null]
  });
  const [submitted, setSubmitted] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setData({
      name: [false, genre.name],
      description: [false, genre.description],
      thumbnail: [false, genre.thumbnail]
    });
  }, [genre]);

  const handleSubmit = () => {
    setSubmitted(true);
    if (isMissing(data, ['description'])) return;

    setUpdating(true);
    editGenre(authState.token, genre.id, data)
      .then(res => {
        if (res.status === 'success') {
          setUpdating(false);
          handleUpdateGenre(genre.id);
          libDispatch(libActions.setNotification(true, true, 'Genre Updated'));
        } else throw res.data;
      })
      .catch(err => {
        setUpdating(false);
        if (typeof err !== 'string') {
          err = 'Failed to update genre';
        }

        libDispatch(libActions.setNotification(true, false, err));
      });
  };

  const handleDelete = () => {
    setDeleting(true);
    deleteGenre(authState.token, genre.id)
      .then(res => {
        if (res.status === 'success') {
          setDeleting(false);
          handleDeleteGenre(genre.id);
          libDispatch(libActions.setNotification(true, true, 'Genre Deleted'));
        } else throw res.data;
      })
      .catch(err => {
        setDeleting(false);
        if (typeof err !== 'string') {
          err = 'Failed to delete genre';
        }

        libDispatch(libActions.setNotification(true, false, err));
      });
  };

  return (
    <div>
      <GenreForm
        genre={{
          name: data.name[1],
          description: data.description[1] || '',
          thumbnail: data.thumbnail[1]
        }}
        thumbnailLink={genre.thumbnail}
        handleChangeInfo={e => {
          const target = e.target;
          setData({
            ...data,
            [target.getAttribute('name')]: [true, target.value]
          });
        }}
        handleChangeThumbnail={thumbnail => {
          setData({ ...data, thumbnail: [true, thumbnail] });
        }}
        submitted={submitted}
      />
      <div className='mt-2 clearfix'>
        <ButtonRegular
          className='deny float-left'
          disabled={deleting}
          onClick={handleDelete}
        >
          DELETE
        </ButtonRegular>
        <ButtonRegular
          className='float-right'
          disabled={updating}
          onClick={handleSubmit}
        >
          UPDATE
        </ButtonRegular>
      </div>
    </div>
  );
}

function GenreForm({
  genre = {},
  thumbnailLink = '',
  handleChangeInfo = e => {},
  handleChangeThumbnail = thumbnail => {},
  submitted = false
}) {
  const [thumbnailSrc, setThumbnailSrc] = useState('');

  const refThumbnail = useRef();

  useEffect(() => {
    setThumbnailSrc(thumbnailLink);
  }, [thumbnailLink]);

  return (
    <div>
      <section>
        <InputTextRegular
          type='text'
          placeholder='Enter genre title'
          name='name'
          value={genre.name}
          onChange={handleChangeInfo}
          error={submitted && !genre.name}
          errMessage='Please provide a name for the genre'
        />
      </section>
      <section className='mt-2 d-flex flex-row edit'>
        <InputFileLabel
          for='thumbnail'
          keep={true}
          className='thumbnail input-custom__label--img'
          error={submitted && !genre.thumbnail}
        >
          <div className='img-wrapper'>
            <input
              type='file'
              name='thumbnail'
              id='thumbnail'
              ref={refThumbnail}
              className='input-custom'
              accept='image/*'
              onChange={evt => {
                let file = refThumbnail.current.files[0];
                if (file) {
                  let reader = new FileReader();
                  reader.readAsDataURL(file);

                  reader.onloadend = e => {
                    handleChangeThumbnail(file);
                    setThumbnailSrc(reader.result);
                  };
                }
              }}
            />
            <img src={thumbnailSrc || Placeholder} className='img' />
          </div>
        </InputFileLabel>
        <div className='flex-1 ml-2'>
          <InputTextRegular
            area
            placeholder='Description for the music genre'
            name='description'
            onChange={handleChangeInfo}
            value={genre.description}
          />
        </div>
      </section>
    </div>
  );
}

export default GenresMgmt;
