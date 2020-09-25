import React, { useCallback, useRef, useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

const Control = ({ iconName }) => (
  <i style={styles.button} className="material-icons" role="button">
    {iconName}
  </i>
);

const styles = {
  video: { width: 320, height: 568 },
  button: {
    fontSize: 30,
    color: 'white',
    display: 'block'
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 15,
    right: 15,
    height: 42,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    zIndex: 100
  }
};

export const ShowcaseFrame = ({ url }) => {
  const video = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const onClick = useCallback(() => {
    if (isPlaying) {
      video.current?.pause();
    } else {
      video.current?.play();
    }
  }, [isPlaying]);
  const onPlay = useCallback(() => setIsPlaying(true), []);
  const onStop = useCallback(() => setIsPlaying(false), []);
  return (
    <div className="marvel-device nexus5" role="figure">
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
          onPlay={onPlay}
          onPause={onStop}
          onAbort={onStop}
          style={styles.video}>
          <source src={useBaseUrl(url)} type="video/mp4" />
        </video>
      </div>
      <div style={styles.controls}>
        <a onClick={onClick}>
          {isPlaying ? (
            <Control iconName="pause" />
          ) : (
            <Control iconName="play_arrow" />
          )}
        </a>
      </div>
    </div>
  );
};
