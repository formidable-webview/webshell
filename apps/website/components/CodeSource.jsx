/* eslint-disable compat/compat */
import * as React from 'react';
import DocusaurusCodeBlock from '@theme/CodeBlock';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

function useSource(uri) {
  const [state, setState] = React.useState({ content: '', error: false });
  React.useEffect(() => {
    let canceled = false;
    async function getSource() {
      try {
        const response = await fetch(uri);
        if (response.ok) {
          const content = await response.text();
          !canceled && setState({ error: false, content });
        } else {
          !canceled && setState({ error: true, content: '' });
        }
      } catch (e) {
        console.info(e);
        !canceled && setState({ error: true, content: '' });
      }
    }
    getSource();
    return () => {
      canceled = true;
    };
  }, [uri]);
  return state;
}

const CodeSourceBlockWrapper = ({ children }) => (
  <div className="margin-vert--md mdxCodeBlock__-node_modules-@docusaurus-theme-classic-lib-theme-MDXComponents-">
    {children}
  </div>
);

export const CodeSourceBlock = ({ lang, lines, title, content }) => {
  return (
    <DocusaurusCodeBlock
      className={`language-${lang}`}
      metastring={`${lines ? `{${lines}}` : ''} ${
        title ? `title="${title}"` : ''
      }`}
      title={title}>
      {content}
    </DocusaurusCodeBlock>
  );
};

export const SingleCodeSource = ({ source, lang, lines, title }) => {
  const fetchURL = useBaseUrl(`/snippets/${source}`);
  const srcState = useSource(fetchURL);
  const realTitle = title || source;
  return srcState.error ? (
    <div className="admonition admonition-warning alert alert--danger">
      {fetchURL} snippet could not be loaded
    </div>
  ) : (
    <CodeSourceBlockWrapper>
      <CodeSourceBlock
        lang={lang}
        content={srcState.content}
        lines={lines}
        title={realTitle}
      />
    </CodeSourceBlockWrapper>
  );
};

export const InstallPackageSnippet = ({ packages, dev = false }) => {
  return (
    <Tabs
      defaultValue="yarn"
      groupId="package-manager"
      values={[
        { label: 'yarn', value: 'yarn' },
        { label: 'npm', value: 'npm' }
      ]}>
      <TabItem value="yarn">
        <CodeSourceBlock
          lang="sh"
          content={`yarn add ${dev ? '--dev ' : ''}${packages
            .split(/\s+/)
            .join(' \\\n         ')}`}
        />
      </TabItem>
      <TabItem value="npm">
        <CodeSourceBlock
          lang="sh"
          content={`npm install --save ${
            dev ? '--only=dev ' : ''
          }${packages.split(/\s+/).join(' \\\n    ')}`}
        />
      </TabItem>
    </Tabs>
  );
};

export const DualCodeSource = ({
  sourceBase,
  titleBase,
  jsx = false,
  lines = null
}) => {
  const tsFetchURL = useBaseUrl(
    `/snippets/${sourceBase}.${jsx ? 'tsx' : 'ts'}`
  );
  const jsFetchURL = useBaseUrl(
    `/snippets/${sourceBase}.${jsx ? 'jsx' : 'js'}`
  );
  const tsState = useSource(tsFetchURL);
  const jsState = useSource(jsFetchURL);
  const realTitleBase = titleBase || sourceBase;
  return tsState.error ? (
    <div className="admonition admonition-warning alert alert--danger">
      {tsFetchURL} snippet could not be loaded
    </div>
  ) : jsState.error ? (
    <div className="admonition admonition-warning alert alert--danger">
      {jsFetchURL} snippet could not be loaded
    </div>
  ) : (
    <CodeSourceBlockWrapper>
      <Tabs
        defaultValue="ts"
        groupId="javascript-source"
        values={[
          { label: 'Typescript', value: 'ts' },
          { label: 'JavaScript', value: 'js' }
        ]}>
        <TabItem value="ts">
          <CodeSourceBlock
            lang={jsx ? 'tsx' : 'ts'}
            content={tsState.content}
            lines={lines}
            title={`${realTitleBase}.${jsx ? 'tsx' : 'ts'}`}
          />
        </TabItem>
        <TabItem value="js">
          <CodeSourceBlock
            lang={jsx ? 'jsx' : 'js'}
            content={jsState.content}
            lines={lines}
            title={`${realTitleBase}.${jsx ? 'jsx' : 'js'}`}
          />
        </TabItem>
      </Tabs>
    </CodeSourceBlockWrapper>
  );
};
