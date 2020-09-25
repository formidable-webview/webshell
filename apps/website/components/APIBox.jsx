import * as React from 'react';
import { APIReference } from './APIReference';

export const APIBox = (props) => {
  return (
    <div className="card api-box shadow--lt" style={{ textAlign: 'center' }}>
      <div className={'card__header api-box__title'}>~ API Reference ~</div>
      <APIReference {...props} />
    </div>
  );
};
