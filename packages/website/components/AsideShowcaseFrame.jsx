import React from 'react';
import { ShowcaseFrame } from '../components/ShowcaseFrame';

export function AsideShowcaseFrame({ children, url }) {
  return (
    <div
      className="margin-vert--lg"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
      <div style={{ marginRight: 20, flexBasis: 400 }}>{children}</div>
      <ShowcaseFrame url={url} />
    </div>
  );
}
