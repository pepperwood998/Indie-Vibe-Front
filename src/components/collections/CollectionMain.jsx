import React, { useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
import { LibraryContext } from '../../contexts';
import { CardMain, CardMainMin, CardProfile } from '../cards';
import { genOneValueArr } from '../../utils/Common';

function CollectionMain({
  full = false,
  header = '',
  items = [],
  generalType = '',
  loading = false
}) {
  let headerClasses = 'collection-main__header';
  headerClasses += full ? ' full' : '';

  return (
    <div className='collection-main'>
      <div className={headerClasses}>{loading ? <Skeleton /> : header}</div>
      <div className='collection-main__content grid crowded'>
        {loading ? (
          <Content loading />
        ) : (
          <Content items={items} generalType={generalType} />
        )}
      </div>
    </div>
  );
}

function Content({ items = [], generalType = '', loading = false }) {
  const { actions: libActions, dispatch: libDispatch } = useContext(
    LibraryContext
  );

  if (loading) {
    let arr = genOneValueArr(6, true);
    return arr.map((value, index) => <CardMain key={index} loading />);
  }

  if (generalType === 'browse-playlist') {
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
