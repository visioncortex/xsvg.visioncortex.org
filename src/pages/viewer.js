import React from 'react';
import Head from '@docusaurus/Head';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './viewer.module.css';

// Interactive viewer — the lib's full pan/zoom viewer (artboard deck + optional
// source inspector) via <XsvgViewInteractive> from @visioncortex/xsvg-viewer/react.
// No local pan/zoom code: the viewer surface is owned by the published package.
//
//   /viewer/?file=<name>     open a bundled sample (static/dataset/<name>.xsvg)
//   /viewer/#src=<base64>    open an inline shared document (utf-8 base64)

function fromBase64(b64) {
  const bin = atob(b64);
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

function ViewerSurface({ datasetBase, playgroundBase }) {
  const { XsvgViewInteractive } = require('@visioncortex/xsvg-viewer/react');

  const params = new URLSearchParams(window.location.search);
  const file = params.get('file');
  const shared = window.location.hash.match(/^#src=(.*)$/);

  let source = null;
  let src = null;
  let name = '';
  if (shared) {
    try {
      source = fromBase64(decodeURIComponent(shared[1]));
    } catch {
      /* ignore */
    }
  } else if (file) {
    name = file.endsWith('.xsvg') ? file : `${file}.xsvg`;
    src = `${datasetBase}${name}`;
    document.title = `xsvg viewer — ${name}`;
  }

  const query = file ? `?file=${encodeURIComponent(file)}` : window.location.hash;
  const playgroundUrl = `${playgroundBase}${query}`;

  return (
    <div className={styles.viewer}>
      <div className={styles.topbar}>
        <a className={styles.brand} href={useBaseUrl('/')}>xsvg</a>
        <span className={styles.sub}>viewer</span>
        {name && <span className={styles.docName}>{name}</span>}
        <span className={styles.spacer} />
        <a className={styles.link} href={playgroundUrl}>Edit in Playground →</a>
      </div>
      <XsvgViewInteractive
        className={styles.stage}
        {...(source ? { source } : { src })}
        inspector
        droppable
      />
    </div>
  );
}

export default function Viewer() {
  const datasetBase = useBaseUrl('/dataset/');
  const playgroundBase = useBaseUrl('/playground/');
  return (
    <>
      <Head>
        <title>xsvg — viewer</title>
        <meta name="robots" content="noindex" />
        <style>{`html,body{margin:0;height:100%;overflow:hidden}#__docusaurus{height:100%}`}</style>
      </Head>
      <BrowserOnly fallback={<div />}>
        {() => <ViewerSurface datasetBase={datasetBase} playgroundBase={playgroundBase} />}
      </BrowserOnly>
    </>
  );
}
