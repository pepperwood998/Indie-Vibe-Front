import React from 'react';

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
  let { items } = props;

  if (props.generalType === 'browse-playlist') {
    return items.map((item, index) => (
      <CardMainMin content={item} key={index} index={index} />
    ));
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
