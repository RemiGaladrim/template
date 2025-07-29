import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Request,
	UseGuards,
} from "@nestjs/common";
import { AuthResponse, SignInDto, SignUpDto, UserDto } from "@project/shared";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("signup")
	@HttpCode(HttpStatus.CREATED)
	async signUp(@Body() signUpDto: SignUpDto): Promise<AuthResponse> {
		return this.authService.signUp(signUpDto);
	}

	@Post("signin")
	@HttpCode(HttpStatus.OK)
	async signIn(@Body() signInDto: SignInDto): Promise<AuthResponse> {
		return this.authService.signIn(signInDto);
	}

	@Get("me")
	@UseGuards(JwtAuthGuard)
	async getProfile(@Request() req): Promise<UserDto> {
		const user = await this.authService.getUserById(req.user.sub);
		if (!user) {
			throw new Error("Utilisateur non trouvé");
		}
		return user;
	}
}
