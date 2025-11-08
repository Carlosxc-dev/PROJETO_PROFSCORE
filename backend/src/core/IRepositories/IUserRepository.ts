import { User } from "core/entities/user";

export interface IUserRepository {
	getAllUser(): Promise<User[]>;
	getUserByEmail(email: string): Promise<User | null>;
	findUserById(userId: string): Promise<User | null>;
	getMe(idUser: string): Promise<User | null>;
	createUser(userData: User): Promise<User>;
	updateUser(userData: User): Promise<User>;
	deleteUser(userId: string): Promise<User>;
	addFarmToUser(userId:string,farmId:string): Promise<any>;
	removeFarmFromUser(farmId:string,userId:string): Promise <any>;
}
