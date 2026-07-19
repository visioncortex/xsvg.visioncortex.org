import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './HomepageFeatures.module.css';

// Each feature row shows a real, compiled example (live in an <iframe> pointing at
// the /preview/ page) beside a description that links into the reference docs.
const FeatureList = [
  {
    title: 'Text layout SVG never had',
    file: 'home-text-layout.xsvg',
    to: '/docs/text-layout/overview/',
    description:
      'Greedy wrapping, full justification, shrink-to-fit, and the party trick — flowing text inside any shape’s outline, not just a rectangle. Laid out from real font metrics.',
  },
  {
    title: 'Type on a path & envelope warps',
    file: 'home-typepath.xsvg',
    to: '/docs/type-on-a-path/overview/',
    description:
      'Ride text along any curve — a live native textPath, or glyphs deformed with skew and ribbon. Bend whole shapes and outlined text through arch, flag, rise, fisheye, and perspective fields.',
  },
  {
    title: 'Mesh gradients, baked',
    file: 'home-mesh.xsvg',
    to: '/docs/mesh-gradients/overview/',
    description:
      'Corner colours on curved Coons patches — the smooth multi-focal blends no linear or radial gradient can express. SVG 2 specified them; no browser draws them. xsvg bakes them to a tiny texel-aligned PNG.',
  },
  {
    title: 'Diagrams that re-route themselves',
    file: 'home-diagrams.xsvg',
    to: '/docs/diagrams/connectors/',
    description:
      'Connectors route between two elements’ edges — as an orthogonal H–V–H rail or a smooth curve — and re-derive when a box moves. With boolean path algebra and Minkowski offsets, the diagram primitives SVG lacks.',
  },
  {
    title: 'Data visualization',
    file: 'home-dataviz.xsvg',
    to: '/docs/charts/plots/',
    description:
      'A data-coordinate frame: plot maps a domain onto a pixel box for bars and lines; pie turns a value into an angle with explode, donut, and polar-area. Paired with content-driven tables — all baked to plain shapes, no chart runtime.',
  },
];

function FeatureRow({ title, description, file, to, reverse }) {
  const previewUrl = useBaseUrl(`/preview/?file=${file}`);
  return (
    <div className={clsx(styles.row, reverse && styles.rowReverse)}>
      <div className={styles.text}>
        <h3>{title}</h3>
        <p>{description}</p>
        <Link to={to} className={styles.more}>
          Learn more →
        </Link>
      </div>
      <div className={styles.frameWrap}>
        <iframe
          className={styles.frame}
          src={previewUrl}
          title={`xsvg example: ${title}`}
          loading="lazy"
          scrolling="no"
        />
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={clsx('home-section', 'home-section-alt')}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Every extension lowers to plain SVG</h2>
        {FeatureList.map((props, idx) => (
          <FeatureRow key={props.file} {...props} reverse={idx % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
