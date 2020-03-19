import React from 'react';

import { CardMain } from '../cards';
import CardProfile from '../cards/CardProfile';

function CollectionMain(props) {
  return (
    <div className='collection-main collection-main--extended'>
      <div className='collection-main__header'>{props.header}</div>
      <div className='collection-main__content grid'>
        <Content data={props.data} extra={props.extra} />
      </div>
    </div>
  );
}

function Content(props) {
  let { items, offset, limit } = props.data;

  switch (props.extra.type) {
    case 'playlist':
    case 'release':
      return items.map((item, index) => (
        <CardMain
          content={item}
          key={index}
          index={index}
          extra={props.extra}
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
            extra={props.extra}
          />
        ));
  }

  return '';
}

export default CollectionMain;
