//Import here the seeders
import runUser from "./userSeeder"

const run = async (): Promise<void> => {
    await runUser()
}
const executeRun = async (): Promise<void> => {
    await run()
}
executeRun()
export default run