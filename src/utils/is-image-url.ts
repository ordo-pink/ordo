const imageExtensions = [
	".apng",
	".avif",
	".gif",
	".jpg",
	".jpeg",
	".jfif",
	".pjpeg",
	".pjp",
	".png",
	".svg",
	".webp",
] as const;

export type ImageExtension = typeof imageExtensions[number];

export const isImageUrl = (url: string) => imageExtensions.some((ext) => url.endsWith(ext));
