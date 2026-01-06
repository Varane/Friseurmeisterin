import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

marked.setOptions({
  mangle: false,
  headerIds: false
});

const allowedTags = [
  'p',
  'br',
  'strong',
  'em',
  'ul',
  'ol',
  'li',
  'a',
  'code',
  'pre',
  'h3',
  'h4'
];

export const renderMarkdown = (content: string): string => {
  const raw = marked.parse(content || '');
  return sanitizeHtml(raw, {
    allowedTags,
    allowedAttributes: {
      a: ['href', 'rel', 'target']
    },
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          rel: 'noreferrer noopener',
          target: '_blank'
        }
      })
    }
  });
};
