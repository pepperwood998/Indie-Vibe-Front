import React from 'react';
import { DocumentIcon, LibraryIcon, SearchIcon } from '../../assets/svgs';

const listIcon = {
  search: SearchIcon,
  music: LibraryIcon,
  document: DocumentIcon
};

function GroupEmpty({
  isEmpty = false,
  message = '',
  children,
  iconType = ''
}) {
  return isEmpty ? (
    <div className='empty fadein d-flex flex-column justify-content-center align-items-center'>
      <div className='pb-1'>
        <MapIcon type={iconType} />
      </div>
      <span>{message}</span>
    </div>
  ) : (
    <React.Fragment>{children}</React.Fragment>
  );
}

function MapIcon({ type = '' }) {
  switch (type) {
    case 'search':
      return <SearchIcon className='svg--big' />;
    case 'library':
      return <LibraryIcon className='svg--big' />;
    case 'document':
      return <DocumentIcon className='svg--big' />;
    default:
      return <LibraryIcon className='svg--big' />;
  }
}

export const ICON = {
  SEARCH: 'search',
  DOCUMENT: 'document',
  LIBRARY: 'library'
};
export default GroupEmpty;
