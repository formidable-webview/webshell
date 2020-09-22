import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

export const ShowcaseFrame = () => {
  return (
    <div
      className="margin-vert--lg"
      style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="marvel-device nexus5">
        <div className="top-bar" />
        <div className="sleep" />
        <div className="volume" />
        <div className="camera" />
        <div className="screen">
          <video
            controls
            loop
            autoPlay
            style={{ width: 320 }}
            src={useBaseUrl('/img/autoheight-screencast.webm')}
          />
        </div>
      </div>
    </div>
  );
};
