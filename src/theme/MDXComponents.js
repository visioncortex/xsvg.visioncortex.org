// Register global MDX components so docs can use <Example> without importing it in
// every file. See https://docusaurus.io/docs/markdown-features/react#mdx-component-scope
import MDXComponents from '@theme-original/MDXComponents';
import Example from '@site/src/components/Example';

export default {
  ...MDXComponents,
  Example,
};
