export default {
  SearchDocsResponseDto: {
    type: 'object',
    properties: {
      code: {
        type: 'number',
        example: 200,
      },
      message: {
        type: 'string',
        example: 'success',
      },
      results: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            file: {
              type: 'string',
              example: 'overview.md',
            },
            segment: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['## Switcher', 'Switcher is a feature flag management system'],
            },
            found: {
              type: 'number',
              example: 1,
            },
            cache: {
              type: 'boolean',
              example: false,
            },
          },
        },
      },
    },
  },
};
