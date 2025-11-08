import bcrypt from 'bcryptjs';

export interface IPasswordService {
	hash(password: string): Promise<string>;
	compare(password: string, hashedPassword: string): Promise<boolean>;
}

export class BcryptPasswordService implements IPasswordService {
    private readonly saltRounds = 12;

    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    async compare(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}