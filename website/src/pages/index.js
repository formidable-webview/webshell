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

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  const autoheightURL = useBaseUrl('docs/autoheight');
  const features = [
    {
      title: "Don't Repeat Ourselves",
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
      title: 'Leveraging WebView Potential',
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
      description: (
        <>
          Discorver a landmark use-case: the{' '}
          <APIReference
            overrideUrl={autoheightURL}
            reference="useAutoheight"
            type="function"
          />{' '}
          hook. Its underlying complexity finally demystified!
        </>
      )
    },
    {
      title: 'Written in Typescript',
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
      description: (
        <>
          Create instances of features, pass them to{' '}
          <APIReference reference="makeWebshell" type="function" />{' '}
          <Term id="HOC" />, and enjoy! The API is terse, and yet can be
          extended at will.
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
