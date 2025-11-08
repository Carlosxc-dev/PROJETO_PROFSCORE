import { AuthTokens } from "core/entities/Auth";

export interface IRefreshTokenUseCase {
  execute(refreshToken: string): Promise<AuthTokens>;
}