import { useMutation, useQuery, useQueryClient } from "react-query";

export function useQueryCustom({
	name,
	url,
	params = {},
	onSuccess,
	onError,
	enabled = true,
	// showErrorToast = true,
	...options
}) {
	return useQuery({
		queryKey: [name, ...Object.values(params)],
		queryFn: () => url(params),
		enabled,
		onSuccess: (data) => {
			onSuccess?.(data);
		},
		onError: (error) => {
			console.error(`Query [${name}] error:`, error);
			// if (showErrorToast) {
			// }
			onError?.(error);
		},
		...options,
	});
}

export function useMutationCustom({
	name,
	mutationFn,
	onSuccess,
	onError,
	invalidateQueries = [],
	url,
	// showSuccessToast = true,
	// showErrorToast = true,
	// successMessage = "عملیات با موفقیت انجام شد",
	...options
}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: name,
		mutationFn: mutationFn || url,
		onSuccess: (data, variables, context) => {
			console.log("* * * useMutationCustom :", { data, variables, context });

			// ابطال کش‌های مورد نیاز
			if (invalidateQueries.length > 0) {
				invalidateQueries.forEach((queryKey) => {
					queryClient.invalidateQueries(queryKey);
				});
			}

			// نمایش پیام موفقیت
			// if (showSuccessToast) {
			// }

			onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			console.log("* * * useMutationCustom :", { error, variables, context });

			console.error(`Mutation [${name}] error:`, error);
			// if (showErrorToast) {
			// }
			onError?.(error, variables, context);
		},
		...options,
	});
}
