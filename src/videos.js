export const initVideos = () => {
	const videos = [...document.querySelectorAll('video')];

	if (videos.length > 0) {
		videos[0].play();
		console.log('video', videos[0]);
	}
};
