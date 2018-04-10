'use strict';

module.exports = {
  title: 'Nabu item data feed',
  type: 'object',
  required: [
    'openAccess',
    'title',
    'date',
    'description',
    'citation',
    'rights',
    'collectionId',
    'collectionLink',
    'itemId'
  ],
  properties: {
    openAccess: {type: 'boolean'},
    identifier: {type: 'array', minItems: 1, uniqueItems: true},
    title: {type: 'string'},
    date: {type: 'string'},
    description: {type: 'string'},
    citation: {type: 'string'},
    contributor: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {type: 'string'},
          role: {type: 'string'}
        },
        required: ['name', 'role']
      }
    },
    images: {
      type: 'array',
      items: {type: 'string'}
    },
    documents: {
      type: 'array',
      items: {type: 'string'}
    },
    media: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {type: 'string'},
          type: {type: 'string'},
          files: {type: 'array', items: {type: 'string'}},
          eaf: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {type: 'string'},
                url: {type: 'string'}
              },
              required: ['name', 'url']
            }
          },
          trs: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {type: 'string'},
                url: {type: 'string'}
              },
              required: ['name', 'url']
            }
          },
          ixt: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {type: 'string'},
                url: {type: 'string'}
              },
              required: ['name', 'url']
            }
          },
          flextext: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {type: 'string'},
                url: {type: 'string'}
              },
              required: ['name', 'url']
            }
          }
        },
        required: ['name', 'type', 'files', 'eaf', 'trs', 'ixt', 'flextext']
      }
    },
    rights: {type: 'string'},
    transcriptions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {type: 'string'},
          url: {type: 'string'}
        },
        required: ['name', 'url']
      }
    },
    thumbnails: {type: 'array', items: {type: 'string'}},
    audioVisualisations: {type: 'object'},
    collectionId: {type: 'string'},
    collectionLink: {type: 'string'},
    itemId: {type: 'string'}
  }
};
