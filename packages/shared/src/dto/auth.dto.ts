import { z } from "zod";

// Schémas Zod pour la validation et génération de types

export const SignInDtoSchema = z.object({
	email: z.string().email("Format d'email invalide"),
	password: z.string().min(1, "Le mot de passe est requis"),
});

export const SignUpDtoSchema = z.object({
	email: z.string().email("Format d'email invalide"),
	password: z
		.string()
		.min(8, "Le mot de passe doit contenir au moins 8 caractères"),
	name: z.string().min(1, "Le nom est requis"),
});

export const JwtPayloadDtoSchema = z.object({
	sub: z.string(),
	email: z.string().email(),
	iat: z.number().optional(),
	exp: z.number().optional(),
});

export const UserDtoSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	name: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const AuthResponseSchema = z.object({
	access_token: z.string(),
	refresh_token: z.string().optional(),
	user: UserDtoSchema,
});

// Types inférés de Zod
export type SignInDto = z.infer<typeof SignInDtoSchema>;
export type SignUpDto = z.infer<typeof SignUpDtoSchema>;
export type JwtPayloadDto = z.infer<typeof JwtPayloadDtoSchema>;
export type UserDto = z.infer<typeof UserDtoSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
