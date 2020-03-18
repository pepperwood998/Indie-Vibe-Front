import React from 'react';
import { LinkWhiteColor } from '../links';

function ContextPlaylist(props) {
  let classes = ['context-menu', props.className].join(' ');

  return (
    <div className={classes}>
      <ul>
        <li>
          <LinkWhiteColor>Set public</LinkWhiteColor>
        </li>
        <li>
          <LinkWhiteColor>Edit</LinkWhiteColor>
        </li>
        <li>
          <LinkWhiteColor>Delete</LinkWhiteColor>
        </li>
      </ul>
    </div>
  );
}

export default ContextPlaylist;
