import React from 'react';

import { CardMain } from '../cards';
import CardProfile from '../cards/CardProfile';

function CollectionMain(props) {
  return (
    <div className='collection-main collection-main--extended'>
      <div className='collection-main__header'>{props.header}</div>
      <div className='collection-main__content grid'>
        <Content data={props.data} type={props.type} />
      </div>
    </div>
  );
}

function Content(props) {
  let { items, offset, limit } = props.data;

  switch (props.type) {
    case 'playlist':
    case 'release':
      return items.map((item, index) => (
        <CardMain content={item} key={index} index={index} />
      ));
    case 'artist':
    case 'profile':
      return items
        .slice(offset, limit)
        .map((item, index) => (
          <CardProfile content={item} key={index} index={index} />
        ));
  }

  return '';
}

export default CollectionMain;
