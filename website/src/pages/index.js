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
import { ReactLogo } from './react';
import { TypescriptLogo } from './typescript';

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
          <a href="/docs/autoheight">the Autoheight WebView</a>. We depict
          caveats and feature workarounds to{' '}
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
