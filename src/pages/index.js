import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import CodeBlock from '@theme/CodeBlock';
import HomepageFeatures from '../components/HomepageFeatures';
import styles from './index.module.css';

function HomepageHeader() {
  const previewUrl = useBaseUrl('/preview/?file=artboards.xsvg');
  return (
    <header className={styles.hero}>
      <div className="container">
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <h1 className={styles.title}>xsvg</h1>
            <p className={styles.subtitle}>eXtensible SVG</p>
            <p className={styles.blurb}>
              Author a <strong>superset of SVG</strong> — plain XML with a handful of{' '}
              <code>x:</code> extensions — that compiles to a plain, static SVG file. The text
              layout, diagrams, and mesh gradients SVG never shipped.
            </p>
            <div className={styles.buttons}>
              <Link className="button button--primary button--lg" to="/docs/introduction/what-is-xsvg/">
                Read the docs
              </Link>
              <Link className="button button--secondary button--lg" to="/playground/">
                Playground
              </Link>
            </div>
            <div className={styles.install}>
              <CodeBlock language="bash">npm install @visioncortex/xsvg-viewer</CodeBlock>
            </div>
          </div>
          <div className={styles.heroPreview}>
            <iframe
              className={styles.heroFrame}
              src={previewUrl}
              title="xsvg example — artboard slide deck"
              loading="eager"
              scrolling="no"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function CompileStrip() {
  return (
    <section className={styles.compile}>
      <div className="container">
        <div className={styles.compileGrid}>
          <div>
            <h3 className={styles.compileHeading}>You author this…</h3>
            <CodeBlock language="xml">{`<x:pie cx="60" cy="60" r="50">
  <x:slice value="40"/>
  <x:slice value="60" fill="#0ea5e9"/>
</x:pie>`}</CodeBlock>
          </div>
          <div className={styles.arrow}>→</div>
          <div>
            <h3 className={styles.compileHeading}>…and get plain SVG</h3>
            <CodeBlock language="xml">{`<path d="M60,10 A50,50 0 0 1 …Z" fill="#6366f1"/>
<path d="M60,60 L60,10 A50,50 …Z" fill="#0ea5e9"/>
…`}</CodeBlock>
          </div>
        </div>
        <p className={styles.compileNote}>
          The <code>x:</code> tags live in their own XML namespace, so a viewer that doesn't
          understand them simply skips them — <strong>the file never breaks</strong>. You compile
          when you want the effects baked in.
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title="eXtensible SVG" description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <CompileStrip />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
