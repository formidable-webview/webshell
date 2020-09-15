import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: "Don't Repeat Ourselves",
    description: (
      <>
        The ultimate goal of <strong>webshell</strong> is to{' '}
        <strong>modularize</strong> scattered features reimplemented in so many{' '}
        <code>WebView</code>-based components and reuse these at will.
      </>
    )
  },
  {
    title: 'Leveraging WebView Potential',
    description: (
      <>
        <strong>Implement</strong>, <strong>test</strong> and{' '}
        <strong>compose</strong> rich behaviors embedded in injected scripts to
        craft amazing, <strong>reliable</strong> <code>WebView</code>-based
        components.
      </>
    )
  },
  {
    title: 'Autoheight Done Right',
    description: (
      <>
        Discorver the landmark use-case: the <code>useAutoheight</code> hook.
        Its underlying complexity finally demystified!
      </>
    )
  }
];

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
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted
              )}
              to={useBaseUrl('docs/')}>
              Get Started
            </Link>
          </div>
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
