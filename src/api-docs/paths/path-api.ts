export default {
  '/api/check': {
    get: {
      tags: ['Health Check'],
      summary: 'Check if the API is running.',
      operationId: 'check',
      responses: {
        200: {
          description: 'API is running.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'ok',
                  },
                  releaseTime: {
                    type: 'string',
                    example: 'today',
                  },
                  sslEnabled: {
                    type: 'boolean',
                    example: true,
                  },
                  rateLimit: {
                    type: 'object',
                    properties: {
                      window: {
                        type: 'string',
                        example: '3000',
                      },
                      max: {
                        type: 'string',
                        example: '10',
                      },
                    },
                  },
                  appSettings: {
                    type: 'object',
                    properties: {
                      url: {
                        type: 'string',
                        example:
                          'https://raw.githubusercontent.com/switcherapi/switcher-management/master/src/assets/documentation',
                      },
                      files: {
                        type: 'string',
                        example: 'overview.md,setup.md',
                      },
                      cacheExpDuration: {
                        type: 'string',
                        example: '5',
                      },
                      cacheSize: {
                        type: 'string',
                        example: '100',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
