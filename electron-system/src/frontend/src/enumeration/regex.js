const regex = {
	number: /^([0-9]+(\.[0-9]*)?|\.([0-9]+))$/,
	email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
	mobile: /^09[0-9]{9}$/,
	// mobile: /^(\98|0)?9\d{9}$/, //  Iranian mobile numbers
};

export default regex;
