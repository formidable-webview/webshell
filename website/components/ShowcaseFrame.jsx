import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

export const ShowcaseFrame = () => {
  return (
    <div
      className="margin-vert--lg"
      style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="marvel-device nexus5">
        <div className="notch">
          <div className="camera" />
          <div className="speaker" />
        </div>
        <div className="top-bar" />
        <div className="sleep" />
        <div className="bottom-bar" />
        <div className="volume" />
        <div className="overflow">
          <div className="shadow shadow--tr" />
          <div className="shadow shadow--tl" />
          <div className="shadow shadow--br" />
          <div className="shadow shadow--bl" />
        </div>
        <div className="inner-shadow" />
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
