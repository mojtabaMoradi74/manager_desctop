// import { calcMinusPercentNumber } from "./calcNumbers";

export const devices = {
	xs: 0,
	ss: 320,
	sm: 320,
	sl: 375,
	slg: 425,
	sxl: 600,
	md: 768,
	g: 900,
	lg: 1024,
	xl: 1280,
};

export const getRatio = {
	"1/1": 100, // Perfect square (used for social media profiles, icons)
	"1/2": (100 / 1) * 2, // Tall vertical banners
	"2/1": (100 / 2) * 1, // Wide banners or panoramas
	"3/2": (100 / 3) * 2, // Photography aspect ratio (used in DSLR cameras)
	"3/4": (100 / 3) * 4, // Portrait version of 4:3, used for vertical images
	"4/3": (100 / 4) * 3, // Standard for old TV screens and projectors (Standard 4:3 aspect ratio)
	"5/4": (100 / 5) * 4, // Common for some photography formats and prints
	"7/5": (100 / 7) * 5, // Used for artistic layouts and posters
	"8.5/11": (100 / 8.5) * 11, // US Letter paper size (portrait orientation)
	"9/16": (100 / 9) * 16, // Vertical version of 16:9, used in social media stories/videos
	"9/21": (100 / 9) * 21, // Vertical version of 21:9
	"11/17": (100 / 11) * 17, // Poster paper size
	"16/9": (100 / 16) * 9, // Modern widescreen displays (HD, Full HD, etc.)
	"21/5": (100 / 21) * 5, // Extremely wide ratio, rare in standard designs
	"21/6": (100 / 21) * 6, // Extremely wide ratio, rare in standard designs
	"21/7": (100 / 21) * 7, // Ultra-wide ratio, occasionally used for banners
	"21/9": (100 / 21) * 9, // Cinema wide aspect ratio (UltraWide screens)
	"100/40": (100 / 100) * 40, // Extremely wide ratio, rare in standard designs
};
