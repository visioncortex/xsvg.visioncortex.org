import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import catalog from '@site/src/data/catalog.json';
import styles from './examples.module.css';

// Strip the inline HTML/entities the catalog blurbs carry (they were authored for a
// different surface) down to readable plain text.
function clean(s) {
  return (s || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function Card({ sample }) {
  const previewUrl = useBaseUrl(`/preview/?file=${sample.file}`);
  const playgroundUrl = useBaseUrl(`/playground/?file=${sample.file}`);
  return (
    <div className={styles.card}>
      <Link className={styles.thumbLink} to={playgroundUrl}>
        <iframe
          className={styles.thumb}
          src={previewUrl}
          title={sample.title}
          loading="lazy"
          scrolling="no"
          tabIndex={-1}
        />
      </Link>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{sample.title}</h3>
        <p className={styles.cardBlurb}>{clean(sample.blurb)}</p>
        <div className={styles.cardLinks}>
          <a href={previewUrl} target="_blank" rel="noopener noreferrer">
            Preview ↗
          </a>
          <Link to={playgroundUrl}>Edit in Playground →</Link>
        </div>
      </div>
    </div>
  );
}

export default function Examples() {
  return (
    <Layout title="Examples" description="A gallery of xsvg samples — every one a complete document you can open in the playground.">
      <div className="container margin-vert--lg">
        <header className={styles.header}>
          <h1>Examples</h1>
          <p>
            Every card is a complete xsvg document, compiled live in your browser. Click any one to
            open it in the <Link to={useBaseUrl('/playground/')}>playground</Link> and edit it.
          </p>
        </header>
        {catalog.map((cat) => (
          <section key={cat.name} className={styles.section}>
            <h2 className={styles.sectionTitle}>{cat.name}</h2>
            {cat.note && <p className={styles.sectionNote}>{clean(cat.note)}</p>}
            <div className={styles.grid}>
              {cat.samples.map((s) => (
                <Card key={s.file} sample={s} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </Layout>
  );
}
