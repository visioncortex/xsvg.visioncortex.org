import React, { useEffect, useRef, useState } from 'react';
import Head from '@docusaurus/Head';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useBaseUrl from '@docusaurus/useBaseUrl';

// Bare, chrome-less preview surface — the target of every <Example> iframe and of
// `Open preview` links. It compiles an xsvg document with @visioncortex/xsvg-viewer
// and shows the plain SVG fit-to-contain (letterboxed, never scrolls), so it embeds
// cleanly at any aspect ratio.
//
//   /preview/?file=<name>        render a bundled sample (static/dataset/<name>.xsvg)
//   /preview/?file=<name>#3      jump to the 3rd artboard of a multi-artboard document
//   /preview/#src=<base64>       render an inline shared document (utf-8 base64)
//
// Deliberately NOT wrapped in <Layout>: no navbar/footer, so it looks like an image.

function fromBase64(b64) {
  const bin = atob(b64);
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

function PreviewSurface({ datasetBase }) {
  const hostRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let preview;
    let cancelled = false;

    (async () => {
      try {
        const { createPreview } = await import('@visioncortex/xsvg-viewer');
        if (cancelled || !hostRef.current) return;

        const params = new URLSearchParams(window.location.search);
        // ?slides=false starts a multi-artboard document with its rail collapsed.
        const slides = params.get('slides') !== 'false';
        preview = createPreview(hostRef.current, { hashDeepLink: true, showErrors: true, slides });

        const file = params.get('file');
        const shared = window.location.hash.match(/^#src=(.*)$/);

        let source = '';
        if (shared) {
          source = fromBase64(decodeURIComponent(shared[1]));
        } else if (file) {
          const name = file.endsWith('.xsvg') ? file : `${file}.xsvg`;
          const res = await fetch(`${datasetBase}${name}`);
          if (!res.ok) throw new Error(`sample not found: ${name}`);
          source = await res.text();
          document.title = `xsvg — ${name}`;
        }
        if (source && !cancelled) await preview.render(source);
      } catch (err) {
        if (!cancelled) setError(String(err));
      }
    })();

    return () => {
      cancelled = true;
      if (preview) preview.destroy();
    };
  }, [datasetBase]);

  return (
    <>
      <div ref={hostRef} style={{ position: 'absolute', inset: 0 }} />
      {error && (
        <pre
          style={{
            position: 'absolute',
            inset: 0,
            margin: 0,
            padding: 16,
            color: '#b00020',
            font: '13px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace',
            whiteSpace: 'pre-wrap',
          }}
        >
          {error}
        </pre>
      )}
    </>
  );
}

export default function Preview() {
  const datasetBase = useBaseUrl('/dataset/');
  return (
    <>
      <Head>
        <title>xsvg — preview</title>
        <meta name="robots" content="noindex" />
        <style>{`html,body{margin:0;height:100%;background:#fff;overflow:hidden}#__docusaurus{height:100%}`}</style>
      </Head>
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        <BrowserOnly fallback={<div />}>
          {() => <PreviewSurface datasetBase={datasetBase} />}
        </BrowserOnly>
      </div>
    </>
  );
}
