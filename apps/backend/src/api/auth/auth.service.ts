import {
	ConflictException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
	AuthResponse,
	JwtPayloadDto,
	SignInDto,
	SignUpDto,
	UserDto,
} from "@project/shared";
import * as argon2 from "argon2";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
	) {}

	async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
		const { email, password, name } = signUpDto;

		const existingUser = await this.prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			throw new ConflictException("Un utilisateur avec cet email existe déjà");
		}

		const hashedPassword = await argon2.hash(password);

		const user = await this.prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				name,
			},
		});

		const payload: JwtPayloadDto = {
			sub: user.id,
			email: user.email,
		};

		const access_token = this.jwtService.sign(payload);

		const userDto: UserDto = {
			id: user.id,
			email: user.email,
			name: user.name,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};

		return {
			access_token,
			user: userDto,
		};
	}

	async signIn(signInDto: SignInDto): Promise<AuthResponse> {
		const { email, password } = signInDto;

		const user = await this.prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			throw new UnauthorizedException("Email ou mot de passe incorrect");
		}

		// Vérifier le mot de passe
		const isPasswordValid = await argon2.verify(user.password, password);

		if (!isPasswordValid) {
			throw new UnauthorizedException("Email ou mot de passe incorrect");
		}

		// Générer le token JWT
		const payload: JwtPayloadDto = {
			sub: user.id,
			email: user.email,
		};

		const access_token = this.jwtService.sign(payload);

		// Retourner la réponse sans le mot de passe
		const userDto: UserDto = {
			id: user.id,
			email: user.email,
			name: user.name,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};

		return {
			access_token,
			user: userDto,
		};
	}

	async validateToken(token: string): Promise<JwtPayloadDto> {
		try {
			return this.jwtService.verify(token);
		} catch (_error) {
			throw new UnauthorizedException("Token invalide");
		}
	}

	async getUserById(id: string): Promise<UserDto | null> {
		const user = await this.prisma.user.findUnique({
			where: { id },
		});

		if (!user) {
			return null;
		}

		return {
			id: user.id,
			email: user.email,
			name: user.name,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}
}
