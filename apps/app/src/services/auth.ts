import { apiClient } from '@neeiz/api-client';

export async function lineLogin(idToken: string) {
  const res = await apiClient.post('/api/auth/line', { idToken });
  return res.data;
}

export async function getHealth() {
  const res = await apiClient.get('/');
  return res.data;
}


