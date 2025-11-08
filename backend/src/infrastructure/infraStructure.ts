import { PrismaClient } from "@prisma/client";

export class InfraStructure {
	public static addBD() {
		return new PrismaClient();
	}

	public static servicesAuths() {
		
	}
}
