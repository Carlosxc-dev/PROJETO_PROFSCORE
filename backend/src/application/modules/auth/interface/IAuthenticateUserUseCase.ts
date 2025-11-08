import { AuthTokens } from "core/entities/Auth";

export interface IAuthenticateUserUseCase {
  execute(email: string, password: string): Promise<AuthTokens>;
}

