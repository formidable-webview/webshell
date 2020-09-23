import React, { useRef, useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

const Control = ({ iconName }) => (
  <i style={{ fontSize: 30, color: 'white' }} className="material-icons">
    {iconName}
  </i>
);

export const ShowcaseFrame = ({ url }) => {
  const video = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const onClick = () => {
    if (isPlaying) {
      video.current?.pause();
    } else {
      video.current?.play();
    }
  };
  return (
    <div>
      <div className="marvel-device nexus5">
        <div className="top-bar" />
        <div className="sleep" />
        <div className="volume" />
        <div className="camera" />
        <div className="screen">
          <video
            ref={video}
            controls={false}
            loop
            autoPlay
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            style={{ width: 320, height: 568 }}>
            <source src={useBaseUrl(url)} type="video/mp4" />
          </video>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center'
          }}>
          <div
            style={{
              borderRadius: 10,
              height: 30
            }}>
            <a onClick={onClick}>
              {isPlaying ? (
                <Control iconName="pause_circle_filled" />
              ) : (
                <Control iconName="play_circle_filled" />
              )}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
