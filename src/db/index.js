import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'

const connectDatabase = async()=>{
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        )

    console.log(`\n MongoDB connected! Your DB_Host is: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Failed to connect MongoDB", error)
        process.exit(1)
    }
}
export default connectDatabase