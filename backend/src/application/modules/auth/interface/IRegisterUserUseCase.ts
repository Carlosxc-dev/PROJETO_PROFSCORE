import { User } from "core/entities/user";


export interface IRegisterUserUseCase {
  execute(email: string, password: string, role?: string): Promise<User>;
}