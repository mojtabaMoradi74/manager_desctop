import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
	const location = useLocation();
	useEffect(() => {
		const noScroll = ["search"];
		console.log({ location }, location.pathname?.includes(noScroll));

		if (!location.pathname?.includes(noScroll)) window.scrollTo(0, 0);
	}, [location.pathname]);

	return <></>;
};

export default ScrollToTop;
