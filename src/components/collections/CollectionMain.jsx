import React, { useContext } from 'react';
import { LibraryContext } from '../../contexts';
import { CardMain, CardMainMin, CardProfile } from '../cards';

function CollectionMain(props) {
  let headerClasses = 'collection-main__header';
  headerClasses += props.full ? ' full' : '';

  return (
    <div className='collection-main'>
      <div className={headerClasses}>{props.header}</div>
      <div className='collection-main__content grid crowded'>
        <Content items={props.items} generalType={props.generalType} />
      </div>
    </div>
  );
}

function Content(props) {
  const { actions: libActions, dispatch: libDispatch } = useContext(
    LibraryContext
  );

  let { items } = props;

  if (props.generalType === 'browse-playlist') {
    if (items.length > 0) {
      return items.map((item, index) => (
        <CardMainMin content={item} key={index} index={index} />
      ));
    }

    // No playlist in library
    return (
      <span
        className='link link-underline font-short-s font-gray-light'
        onClick={() => {
          libDispatch(libActions.setEditPlaylist(true));
        }}
      >
        Create a playlist
      </span>
    );
  }

  return items.map((item, index) => {
    if (!item) return '';

    switch (item.type) {
      case 'playlist':
      case 'release':
        return <CardMain content={item} key={index} index={index} />;
      case 'artist':
      case 'profile':
        return <CardProfile content={item} key={index} index={index} />;
      default:
        return '';
    }
  });

  // switch (props.type) {
  //   case 'playlist':
  //   case 'release':
  //     return items.map((item, index) => (
  //       <CardMain content={item} key={index} index={index} />
  //     ));
  //   case 'artist':
  //   case 'profile':
  //     return items.map((item, index) => (
  //       <CardProfile content={item} key={index} index={index} />
  //     ));
  //   case 'browse-playlist':
  //     return items.map((item, index) => (
  //       <CardMainMin content={item} key={index} index={index} />
  //     ));
  // }

  // return '';
}

export default CollectionMain;
