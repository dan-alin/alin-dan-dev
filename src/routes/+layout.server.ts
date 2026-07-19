import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ request }) => {
	const userAgent = request.headers.get('user-agent') || '';
	const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

	return {
		socialLinks: {
			github: 'https://github.com/dan-alin',
			linkedin: 'https://www.linkedin.com/in/alin-dan-24aa67211'
		},
		isMobile
	};
};
