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
    file: 'region-flow.xsvg',
    to: '/docs/text-layout/overview/',
    description:
      'Greedy wrapping, full justification, shrink-to-fit, and the party trick — flowing text inside any shape’s outline, not just a rectangle. Laid out from real font metrics.',
  },
  {
    title: 'Type on a path & envelope warps',
    file: 'textpath.xsvg',
    to: '/docs/type-on-a-path/overview/',
    description:
      'Ride text along any curve — a live native textPath, or glyphs deformed with skew and ribbon. Bend whole shapes and outlined text through arch, flag, rise, fisheye, and perspective fields.',
  },
  {
    title: 'Mesh gradients, baked',
    file: 'mesh.xsvg',
    to: '/docs/mesh-gradients/overview/',
    description:
      'Corner colours on a quad/tri mesh — the smooth multi-focal blends no linear or radial gradient can express. SVG 2 specified them; no browser draws them. xsvg bakes them to a tiny texel-aligned PNG.',
  },
  {
    title: 'Diagrams that re-route themselves',
    file: 'connectors.xsvg',
    to: '/docs/diagrams/connectors/',
    description:
      'Connectors route between two elements’ edges and re-derive when a box moves. Boolean path algebra, Minkowski offsets, tables with content-driven row heights — the document primitives SVG lacks.',
  },
  {
    title: 'Charts from a coordinate frame',
    file: 'pie.xsvg',
    to: '/docs/charts/pie/',
    description:
      'A data-coordinate frame: plot maps a domain onto a pixel box for bars and lines; pie turns a value into an angle with explode, donut, and polar-area. Baked to plain shapes — no chart runtime.',
  },
  {
    title: 'Design tokens & theming',
    file: 'theme.xsvg',
    to: '/docs/theming/overview/',
    description:
      'Declare a brand palette and a type scale as compile-time tokens. Fills reference var(name); text pulls a named font. Change a token and the whole document restyles — resolved before it ever ships.',
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
