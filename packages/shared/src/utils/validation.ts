import { z } from "zod";

export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
	return schema.parse(data);
}

export function validateDataSafe<T>(
	schema: z.ZodSchema<T>,
	data: unknown,
):
	| {
			success: true;
			data: T;
	  }
	| {
			success: false;
			error: z.ZodError;
	  } {
	const result = schema.safeParse(data);
	if (result.success) {
		return { success: true, data: result.data };
	} else {
		return { success: false, error: result.error };
	}
}

export function formatZodErrors(error: z.ZodError): Record<string, string> {
	const formatted: Record<string, string> = {};

	error.errors.forEach((err) => {
		const path = err.path.join(".");
		formatted[path] = err.message;
	});

	return formatted;
}
