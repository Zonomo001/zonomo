
import { cookies } from 'next/headers';
import { getServerSideUser } from './payload-utils';

export async function getUserId() {
  const { user } = await getServerSideUser(cookies());
  return user?.id || null;
}
