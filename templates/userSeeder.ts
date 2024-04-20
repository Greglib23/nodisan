import { hash } from "../../services/password.service";
import prisma from '../../models/user'

export default async () => {
    const hashedPassword = await hash("admin123456")
    await prisma.create(
        {
            data: {
                email: "admin@example.com",
                password: hashedPassword
            }
        }
    )
}