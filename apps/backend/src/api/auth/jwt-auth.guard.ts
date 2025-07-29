import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(private authService: AuthService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const authHeader = request.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new UnauthorizedException("Token manquant ou format invalide");
		}

		const token = authHeader.substring(7); // Remove 'Bearer ' prefix

		try {
			const payload = await this.authService.validateToken(token);
			request.user = payload;
			return true;
		} catch (_error) {
			throw new UnauthorizedException("Token invalide");
		}
	}
}
