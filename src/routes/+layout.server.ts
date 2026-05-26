import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ request }) => {
	const userAgent = request.headers.get('user-agent') || '';
	const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

	return {
		githubUrl: 'https://github.com/dan-alin',
		linkedinUrl: 'https://www.linkedin.com/in/alin-dan-24aa67211',
		isMobile
	};
};
