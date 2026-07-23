import React, { useEffect, useRef, useState } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useBaseUrl from '@docusaurus/useBaseUrl';
import catalog from '@site/src/data/catalog.json';
import styles from './playground.module.css';

// Interactive playground — a CodeMirror editor on the left, the live compiled
// preview on the right (the same createPreview() surface the docs iframes use, so
// multi-artboard documents get the slide deck for free). Everything runs in the
// browser; the document round-trips through the URL hash for shareable links.
//
//   /playground/?file=<name>     preload a bundled sample (static/dataset/<name>.xsvg)
//   /playground/#src=<base64>    preload a shared document (utf-8 base64)

const DEFAULT_SAMPLE = 'wrap-vs-overflow.xsvg';

function toBase64(s) {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}
function fromBase64(b64) {
  const bin = atob(b64);
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

function PlaygroundApp({ datasetBase }) {
  const editorHost = useRef(null);
  const previewHost = useRef(null);
  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState('');
  const [ready, setReady] = useState(false);

  const render = React.useCallback(async (source) => {
    const preview = previewRef.current;
    if (!preview) return;
    try {
      const result = await preview.render(source);
      if (result !== 'superseded') setError(null);
    } catch (err) {
      setError(String(err));
    }
  }, []);

  // fetch a sample's source from static/dataset/
  const fetchSample = React.useCallback(
    async (file) => {
      const name = file.endsWith('.xsvg') ? file : `${file}.xsvg`;
      const res = await fetch(`${datasetBase}${name}`);
      if (!res.ok) throw new Error(`sample not found: ${name}`);
      return res.text();
    },
    [datasetBase],
  );

  useEffect(() => {
    let disposed = false;
    let timer;

    (async () => {
      const [{ EditorView, basicSetup }, { xml }, viewer] = await Promise.all([
        import('codemirror'),
        import('@codemirror/lang-xml'),
        import('@visioncortex/xsvg-viewer'),
      ]);
      if (disposed || !editorHost.current || !previewHost.current) return;

      // Resolve relative <use href="…"> deps against /dataset/ so cross-file
      // samples (e.g. use-link.xsvg → logo.xsvg) load their deps while editing.
      const baseUrl = new URL(datasetBase, window.location.origin).href;
      previewRef.current = viewer.createPreview(previewHost.current, { baseUrl });

      const view = new EditorView({
        doc: '',
        parent: editorHost.current,
        extensions: [
          basicSetup,
          xml(),
          EditorView.theme({
            '&': { height: '100%', fontSize: '13px' },
            '.cm-scroller': {
              overflow: 'auto',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            },
          }),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) {
              const doc = u.state.doc.toString();
              setCurrent('');
              clearTimeout(timer);
              timer = setTimeout(() => render(doc), 200);
            }
          }),
        ],
      });
      editorRef.current = {
        view,
        get: () => view.state.doc.toString(),
        set: (text) =>
          view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } }),
      };

      // boot: shared doc, ?file=, or default
      const shared = window.location.hash.match(/^#src=(.*)$/);
      const params = new URLSearchParams(window.location.search);
      const file = params.get('file');
      try {
        if (shared) {
          const doc = fromBase64(decodeURIComponent(shared[1]));
          editorRef.current.set(doc);
          await render(doc);
        } else {
          const name = file ? (file.endsWith('.xsvg') ? file : `${file}.xsvg`) : DEFAULT_SAMPLE;
          const doc = await fetchSample(name);
          editorRef.current.set(doc);
          setCurrent(name);
          await render(doc);
        }
      } catch (err) {
        setError(String(err));
      }
      setReady(true);
    })();

    return () => {
      disposed = true;
      clearTimeout(timer);
      if (previewRef.current) previewRef.current.destroy();
      if (editorRef.current) editorRef.current.view.destroy();
    };
  }, [render, fetchSample]);

  const onPick = async (e) => {
    const file = e.target.value;
    if (!file || !editorRef.current) return;
    try {
      const doc = await fetchSample(file);
      editorRef.current.set(doc);
      setCurrent(file);
      await render(doc);
    } catch (err) {
      setError(String(err));
    }
  };

  const [copied, setCopied] = useState(false);
  const onCopyLink = async () => {
    if (!editorRef.current) return;
    const hash = `#src=${encodeURIComponent(toBase64(editorRef.current.get()))}`;
    window.history.replaceState(null, '', window.location.pathname + window.location.search + hash);
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      /* URL still updated */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const onDownload = async () => {
    if (!editorRef.current) return;
    try {
      const { downloadSvg } = await import('@visioncortex/xsvg-viewer');
      await downloadSvg(editorRef.current.get(), (current || 'drawing').replace(/\.xsvg$/, ''));
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <div className={styles.playground}>
      <div className={styles.toolbar}>
        <label className={styles.picker}>
          Sample{' '}
          <select value={current} onChange={onPick}>
            <option value="" disabled>
              — pick a sample —
            </option>
            {catalog.map((cat) => (
              <optgroup key={cat.name} label={cat.name}>
                {cat.samples.map((s) => (
                  <option key={s.file} value={s.file}>
                    {s.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <span className={styles.spacer} />
        <button type="button" onClick={onCopyLink} disabled={!ready}>
          {copied ? 'Copied!' : 'Copy link'}
        </button>
        <button type="button" onClick={onDownload} disabled={!ready}>
          Download SVG ↓
        </button>
      </div>
      <div className={styles.body}>
        <div className={styles.editor} ref={editorHost} />
        <div className={styles.previewWrap}>
          <div className={styles.preview} ref={previewHost} />
          {error && <div className={styles.error}>{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default function Playground() {
  const datasetBase = useBaseUrl('/dataset/');
  return (
    <Layout title="Playground" description="Edit xsvg and see it compile to plain SVG, live." noFooter>
      <BrowserOnly fallback={<div className={styles.loading}>Loading playground…</div>}>
        {() => <PlaygroundApp datasetBase={datasetBase} />}
      </BrowserOnly>
    </Layout>
  );
}
