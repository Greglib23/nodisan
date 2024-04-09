import bcrypt from 'bcrypt';

const SALT_ROUNDS: number = 10

export const hash = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS)
}

export const compare = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash)
}