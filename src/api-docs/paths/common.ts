export const commonSchemaContent = (ref: string) => ({
  'application/json': {
    schema: {
      $ref: `#/components/schemas/${ref}`,
    },
  },
});

export const queryParameter = (name: string, description: string, required: boolean, type?: string) => ({
  in: 'query',
  name,
  description,
  required,
  schema: {
    type: type || 'string',
  },
});
