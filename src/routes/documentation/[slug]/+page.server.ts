import { error } from '@sveltejs/kit';
import contents from '$lib/content';

export const load = async ({ url }) => {
	if (!contents?.[url.pathname.split('/')[2]]) error(404, { message: 'Not found' });
	return {};
};
