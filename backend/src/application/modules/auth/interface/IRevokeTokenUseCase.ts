export interface IRevokeTokenUseCase {
  execute(refreshToken: string): Promise<void>;
}