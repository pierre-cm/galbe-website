import { error } from '@sveltejs/kit';
import plugins from '$lib/contents/plugins.json';

export const load = async ({ url }) => {
	//@ts-ignore
	if (!plugins?.[url.pathname.split('/')[2]]) error(404, { message: 'Not found' });
	return {};
};
