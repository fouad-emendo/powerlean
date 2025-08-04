import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'powerleanStorage',
  access: (allow) => ({
    // Allow authenticated users to read/write/delete their own files
    'private/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    // Allow public read access but only authenticated users can write
    'public/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete'])
    ]
  })
});