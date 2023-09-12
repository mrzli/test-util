import Ajv, { JSONSchemaType } from 'ajv';
import { PathMappingFile } from '../../types';
import { TEXT_EXTENSION, BINARY_EXTENSION } from './constants';

const AJV = new Ajv();

const SCHEMA: JSONSchemaType<PathMappingFile> = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      group: { type: 'string' },
      files: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            fr: {
              type: 'string',
              pattern: `\\.(${TEXT_EXTENSION}|(${BINARY_EXTENSION}))$`,
            },
            to: { type: 'string' },
          },
          required: ['fr', 'to'],
          additionalProperties: false,
        },
      },
    },
    required: ['group', 'files'],
    additionalProperties: false,
  },
};

const validatePathMapping = AJV.compile(SCHEMA);

export function parsePathMapping(content: string): PathMappingFile {
  const data = JSON.parse(content);
  const isValid = validatePathMapping(data);
  if (!isValid) {
    console.error(validatePathMapping.errors);
    throw new Error('Invalid path mapping data.');
  }

  return data;
}
