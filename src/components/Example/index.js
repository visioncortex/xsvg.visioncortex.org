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
  height = 560, // max height (px) — the box otherwise sizes to the document's aspect ratio
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
  const [aspect, setAspect] = useState(null); // "W / H" from the document's viewBox

  // Fetch the source once on mount: it drives both the collapsible "View source"
  // block and the box's aspect ratio (so the example sizes to the document, not a
  // fixed height). Inline `src` is parsed directly, no fetch.
  useEffect(() => {
    let cancelled = false;
    const applyAspect = (t) => {
      const m = t && t.match(/viewBox\s*=\s*["']\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)/);
      if (m && Number(m[1]) > 0 && Number(m[2]) > 0 && !cancelled) setAspect(`${m[1]} / ${m[2]}`);
    };
    if (src) {
      applyAspect(src);
      return undefined;
    }
    if (!file) return undefined;
    const name = file.endsWith('.xsvg') ? file : `${file}.xsvg`;
    fetch(`${datasetBase}${name}`)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(name))))
      .then((t) => {
        if (cancelled) return;
        setFetched(t);
        applyAspect(t);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [src, file, datasetBase]);

  const canShowSource = showSource && (src || file);
  // Size to the document's aspect ratio, capped at `height`; fall back to a fixed
  // height until the viewBox is known.
  const frameStyle = aspect ? { aspectRatio: aspect, maxHeight: height } : { height };

  return (
    <figure className={styles.example}>
      <div className={styles.frameWrap} style={frameStyle}>
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
