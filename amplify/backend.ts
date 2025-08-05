import { defineBackend } from '@aws-amplify/backend';
import { storage } from './storage/resource';
import { data } from './data/resource';
import { auth } from './auth/resource';

export default defineBackend({
  auth,
  data,
  storage
});
