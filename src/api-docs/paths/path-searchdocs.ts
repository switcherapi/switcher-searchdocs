import { commonSchemaContent, queryParameter } from './common.ts';

export default {
  '/': {
    get: {
      tags: ['Search Docs'],
      summary: 'Search for a term in a list of documents.',
      operationId: 'searchdocs',
      parameters: [
        queryParameter('query', 'The term to search for.', true),
        queryParameter('url', 'The url of the documentation.', false),
        queryParameter('files', 'The files to search in (separated by comma).', false),
        queryParameter('previewLength', 'The length of the result preview.', false),
        queryParameter('ignoreCase', 'Ignore case.', false),
        queryParameter('trimContent', 'Trim content.', false),
        queryParameter('regex', 'Use regex.', false),
        queryParameter('skipCache', 'Skip cache.', false),
      ],
      responses: {
        200: {
          description: 'Search results.',
          content: commonSchemaContent('SearchDocsResponseDto'),
        },
      },
    },
  },
};
