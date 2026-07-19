import React, { useEffect, useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

// <Example> — the MDN-style live example block used throughout the docs.
//
// Renders a card: a compiled, fit-to-contain preview in an <iframe> (pointing at the
// chrome-less /preview/ page), a toolbar linking to the full playground and a
// standalone preview, and — by default — the exact xsvg source in a collapsible,
// syntax-highlighted block. The iframe and the source stay in lockstep because both
// resolve the same document.
//
// Two source modes:
//   <Example file="pie" />                 a bundled sample (static/dataset/pie.xsvg)
//   <Example src={`<svg …>…</svg>`} />     an inline document written in the page
//
// Props: file | src, height (px, default 320), title, caption, showSource (default
// true when a source is resolvable), playground (default true).

// utf-8-safe base64 that works in the browser (btoa) and during SSR (Buffer).
function toBase64(s) {
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    const bytes = new TextEncoder().encode(s);
    let bin = '';
    for (const b of bytes) bin += String.fromCharCode(b);
    return window.btoa(bin);
  }
  return Buffer.from(s, 'utf8').toString('base64');
}

export default function Example({
  file,
  src,
  height = 320,
  title,
  caption,
  showSource = true,
  playground = true,
}) {
  const viewerBase = useBaseUrl('/viewer/');
  const playgroundBase = useBaseUrl('/playground/');
  const datasetBase = useBaseUrl('/dataset/');
  const fileUrl = file
    ? `${datasetBase}${file.endsWith('.xsvg') ? file : `${file}.xsvg`}`
    : null;

  // Build the URLs for the iframe / links (works for both file and inline src).
  const query = file
    ? `?file=${encodeURIComponent(file)}`
    : `#src=${encodeURIComponent(toBase64(src || ''))}`;
  const viewerUrl = `${viewerBase}${query}`;
  const playgroundUrl = `${playgroundBase}${query}`;

  const [open, setOpen] = useState(false);
  const [fetched, setFetched] = useState(src || null);

  // For file-based examples, lazily fetch the source so the code shown is the real,
  // compiled document (never drifts from the iframe).
  useEffect(() => {
    if (!showSource || src || !file || fetched || !open) return;
    let cancelled = false;
    const name = file.endsWith('.xsvg') ? file : `${file}.xsvg`;
    fetch(`${datasetBase}${name}`)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(name))))
      .then((t) => {
        if (!cancelled) setFetched(t);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [showSource, src, file, fetched, open, datasetBase]);

  const canShowSource = showSource && (src || file);

  return (
    <figure className={styles.example}>
      <div className={styles.frameWrap} style={{ height }}>
        <BrowserOnly fallback={<div className={styles.embedLoading}>Compiling…</div>}>
          {() => {
            // The lib's React embed — compiles xsvg → plain SVG inline, no iframe.
            const { XsvgView } = require('@visioncortex/xsvg-viewer/react');
            return (
              <XsvgView
                className={styles.embed}
                {...(src ? { source: src } : { src: fileUrl })}
              />
            );
          }}
        </BrowserOnly>
      </div>

      <div className={styles.toolbar}>
        {title && <span className={styles.title}>{title}</span>}
        <span className={styles.spacer} />
        {canShowSource && (
          <button type="button" className={styles.btn} onClick={() => setOpen((v) => !v)}>
            {open ? 'Hide source' : 'View source'}
          </button>
        )}
        <a className={styles.link} href={viewerUrl} target="_blank" rel="noopener noreferrer">
          Open in viewer ↗
        </a>
        {playground && (
          <a className={styles.linkPrimary} href={playgroundUrl} target="_blank" rel="noopener noreferrer">
            Edit in Playground →
          </a>
        )}
      </div>

      {open && canShowSource && (
        <div className={styles.source}>
          {fetched ? (
            <CodeBlock language="xml">{fetched.trim()}</CodeBlock>
          ) : (
            <div className={styles.loadingSrc}>Loading source…</div>
          )}
        </div>
      )}

      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
