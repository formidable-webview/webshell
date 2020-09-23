import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import { ReactReference } from '../../components/ReactReference';
import { APIReference } from '../../components/APIReference';
import { Term } from '../../components/Term';
import { IllustrationSnippet } from '../../components/IllustrationSnippet';

const TypescriptLogo = () => (
  <svg className={styles.svgLogo} viewBox="0 0 630 630">
    <g
      transform="translate(0.000000,630.000000) scale(0.100000,-0.100000)"
      id="g4">
      <g
        id="g22"
        transform="matrix(1.1623834,0,0,1.1623834,-1019.3422,855.55159)">
        <path
          transform="matrix(10,0,0,-10,0,6300)"
          id="path16"
          d="M 220.10759,458.0521 V 341.75538 h -41.13858 -41.13857 l 0.43427,-25.05448 c 0.23886,-13.77996 0.63806,-25.25802 0.88712,-25.50679 0.52975,-0.52915 219.087,-0.62428 219.59274,-0.0956 0.18769,0.1962 0.4591,11.67426 0.60313,25.50679 l 0.26188,25.15006 H 318.75439 277.89921 V 458.0521 574.34881 H 249.0034 220.10759 Z"
        />
        <path
          transform="matrix(10,0,0,-10,0,6300)"
          id="path18"
          d="m 463.40317,577.14835 c -24.13554,-2.64307 -50.75364,-14.99716 -66.72358,-30.968 -8.70595,-8.70644 -20.74346,-25.95703 -19.16752,-27.46839 1.03109,-0.98883 45.21239,-26.41298 45.89967,-26.41298 0.34728,0 2.38611,2.48825 4.53072,5.52945 4.73438,6.71364 14.96558,16.80442 20.95368,20.66609 8.91275,5.74776 24.69816,9.40776 36.45936,8.45346 16.39983,-1.33068 28.8414,-7.96032 33.78574,-18.00315 1.4886,-3.02362 1.69681,-4.45334 1.69681,-11.65151 0,-7.07313 -0.22192,-8.65532 -1.60872,-11.46955 -4.83613,-9.81389 -13.86406,-15.61941 -46.55096,-29.93515 -41.82341,-18.31721 -58.81423,-31.21821 -70.05461,-53.1919 -6.24253,-12.20347 -7.76312,-19.46451 -7.82103,-37.34656 -0.0413,-12.76504 0.602,-17.75185 3.32163,-25.7479 10.2274,-30.06981 38.6349,-50.09109 73.48379,-51.79055 36.69733,-1.7896 61.48782,7.83134 80.40429,31.20411 2.97633,3.67748 6.39849,8.25565 7.6048,10.1737 l 2.19331,3.48737 -3.16143,2.41393 c -4.45709,3.40324 -39.72981,26.64191 -40.43832,26.64191 -0.32168,0 -2.09865,-2.00665 -3.9488,-4.45923 -11.40826,-15.12286 -19.88647,-19.55756 -36.2768,-18.97532 -6.92727,0.24609 -8.32501,0.52504 -12.4416,2.48303 -8.07892,3.8426 -12.21348,9.41104 -13.71478,18.47115 -1.31862,7.95762 0.97399,16.13173 6.25489,22.30128 4.55543,5.322 13.22886,10.15375 37.42592,20.84906 51.07134,22.57398 70.26912,38.20516 79.21097,64.49497 8.83814,25.98491 5.34187,55.80731 -8.86576,75.62291 -3.91742,5.46369 -12.99617,14.26605 -18.61815,18.05134 -9.65582,6.50129 -24.05452,12.38784 -37.34439,15.26733 -5.62848,1.21951 -9.96337,1.53708 -23.65787,1.73316 -9.22169,0.13203 -19.49576,-0.0588 -22.83126,-0.42406 z"
        />
      </g>
    </g>
  </svg>
);

const ReactLogo = () => (
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

function Feature({ iconName, SVGLogo, title, description }) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <div className={clsx(styles.featureHeader)}>
        <h3>{title}</h3>
        <div className={clsx('text--center', styles.graphicContainer)}>
          {SVGLogo && <SVGLogo />}
          {iconName && (
            <i className={clsx('material-icons', styles.featureIcon)}>
              {iconName}
            </i>
          )}
        </div>
      </div>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  const features = [
    {
      title: "Don't Repeat Ourselves",
      iconName: 'scanner',
      description: (
        <>
          The ultimate goal of <strong>webshell</strong> is to{' '}
          <strong>modularize</strong> scattered features reimplemented in so
          many <ReactReference name="WebView" type="class" />
          -based components and reuse these at will.
        </>
      )
    },
    {
      title: 'Leveraging WebViews',
      iconName: 'important_devices',
      description: (
        <>
          <strong>Implement</strong>, <strong>test</strong> and{' '}
          <strong>compose</strong> rich behaviors embedded in injected scripts
          to craft amazing, <strong>reliable</strong>{' '}
          <ReactReference name="WebView" type="class" />
          -based components.
        </>
      )
    },
    {
      title: 'Autoheight Done Right',
      iconName: 'height',
      description: (
        <>
          Discorver a landmark use-case:{' '}
          <a href={useBaseUrl('/docs/autoheight')}>the Autoheight WebView</a>.
          We depict caveats and feature workarounds to{' '}
          <strong>convey transparency over magic</strong> and let API consumers
          decide.
        </>
      )
    },
    {
      title: 'Written in Typescript',
      SVGLogo: TypescriptLogo,
      description: (
        <>
          We are using advanced typing techniques to augment components with
          props in <Term id="HOC" />
          s. 80% of this package codebase are types, resulting in a small bundle
          and <strong>powerful intellisense</strong>.
        </>
      )
    },
    {
      title: 'Declarative API',
      iconName: 'integration_instructions',
      description: (
        <>
          Create instances of features, pass them to{' '}
          <APIReference reference="makeWebshell" type="function" />{' '}
          <Term id="HOC" />, and enjoy new props and behaviors! The API is
          terse, and yet can be extended at will.
        </>
      )
    },
    {
      title: 'React Native 0.59+',
      SVGLogo: ReactLogo,
      description: (
        <>
          This library provides hooks and thus requires React Native 0.59 or
          greater, and expo SDK 33.0 or greater.
        </>
      )
    }
  ];
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className={clsx(styles.titleContainer)}>
          <h1 className="hero__title">{`${siteConfig.title}`}</h1>
          <p className={clsx('hero__subtitle', styles.subtitle)}>
            {siteConfig.tagline}
          </p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted
              )}
              to={useBaseUrl('docs/')}>
              Get Started{' '}
              <span style={{ fontSize: 30, lineHeight: 1 }}>☕</span>
            </Link>
          </div>
        </div>
        <div className={clsx('snippet', styles.snippet)}>
          <IllustrationSnippet />
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
