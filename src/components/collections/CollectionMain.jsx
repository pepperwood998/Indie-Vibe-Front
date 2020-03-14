import React, { useEffect } from 'react';

import { CardMain } from '../cards';
import CardProfile from '../cards/CardProfile';

function CollectionMain(props) {
  const { header, data, type, short } = props;

  return (
    <div className='collection-main collection-main--extended'>
      <div className='collection-main__header'>{header}</div>
      <div className='collection-main__content grid'>
        <Content data={data} type={type} short={short} />
      </div>
    </div>
  );
}

function Content(props) {
  const { type } = props;
  let { items, offset, limit } = props.data;

  if (props.short) {
    offset = 0;
    limit = 2;
  }

  switch (type) {
    case 'playlist':
    case 'release':
      return items
        .slice(offset, limit)
        .map((item, index) => <CardMain content={item} key={index} />);
    case 'artist':
    case 'profile':
      return items
        .slice(offset, limit)
        .map((item, index) => <CardProfile content={item} key={index} />);
  }

  return '';
}

export default CollectionMain;
