import info from './swagger-info.ts';
import pathApi from './paths/path-api.ts';
import pathSearchDocs from './paths/path-searchdocs.ts';
import searchDocsSchema from './schemas/searchdocs.ts';

export default {
  openapi: '3.0.1',
  info,
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Local',
    },
    {
      url: 'https://docs.switcherapi.com',
      description: 'Cloud API',
    },
  ],
  components: {
    schemas: {
      ...searchDocsSchema,
    },
  },
  paths: {
    ...pathApi,
    ...pathSearchDocs,
  },
};
