import React from 'react';
import styles from './styles.module.css';

export const ReactLogo = () => (
  <svg
    className={styles.svgLogo}
    width="350"
    height="350"
    viewBox="-200 -200 400 400">
    <title>React Logo</title>
    <g clip-path="url(#screen)" class="logo">
      <g class="logoInner">
        <circle cx="0" cy="0" r="30" />
        <g stroke-width="15" fill="none" id="logo">
          <ellipse rx="165" ry="64" />
          <ellipse rx="165" ry="64" transform="rotate(60)" />
          <ellipse rx="165" ry="64" transform="rotate(120)" />
        </g>
      </g>
    </g>
  </svg>
);
