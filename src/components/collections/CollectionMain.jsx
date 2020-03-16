import React from 'react';

import { CardMain } from '../cards';
import CardProfile from '../cards/CardProfile';

function CollectionMain(props) {
  const { header, data, type } = props;

  return (
    <div className='collection-main collection-main--extended'>
      <div className='collection-main__header'>{header}</div>
      <div className='collection-main__content grid'>
        <Content
          data={data}
          type={type}
          handleToggleFavorite={props.handleToggleFavorite}
        />
      </div>
    </div>
  );
}

function Content(props) {
  const { type } = props;
  let { items, offset, limit } = props.data;
  console.log(offset);

  switch (type) {
    case 'playlist':
    case 'release':
      return items
        .slice(offset, limit)
        .map((item, index) => (
          <CardMain
            content={item}
            key={index}
            index={index}
            handleToggleFavorite={props.handleToggleFavorite}
          />
        ));
    case 'artist':
    case 'profile':
      return items
        .slice(offset, limit)
        .map((item, index) => (
          <CardProfile
            content={item}
            key={index}
            index={index}
            handleToggleFavorite={props.handleToggleFavorite}
          />
        ));
  }

  return '';
}

export default CollectionMain;
