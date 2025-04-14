import { useRef } from "react";

const useSearch = ({ handleSearch, setSearchQuery }) => {
	// Debounced function
	const debounce = (value) => {
		clearTimeout(timeoutId.current);
		timeoutId.current = setTimeout(() => {
			performDebouncedOperation(value);
		}, 500);
	};

	// Function to handle input change
	const handleChangeSearch = (event) => {
		const { value } = event.target;
		setSearchQuery(value);
		debounce(value);
	};

	const handleSearchDelay = (value) => {
		setSearchQuery(value);
		debounce(value);
	};

	const timeoutId = useRef();

	// Function to perform the actual operation after debounce
	const performDebouncedOperation = (value) => {
		handleSearch(value);
		// Perform your desired operation here
	};
	return [handleChangeSearch, handleSearchDelay];
};
export default useSearch;
