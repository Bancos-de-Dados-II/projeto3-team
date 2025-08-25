import dotenv from "dotenv";
dotenv.config();
import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  process.env.NEO4J_URI as string,
    neo4j.auth.basic(
        process.env.NEO4J_USER as string,
        process.env.NEO4J_PASSWORD as string
    )
);

console.log("MONGO_URI:", process.env.DATABASE_URL);
console.log("URI:", process.env.NEO4J_URI);
console.log("USER:", process.env.NEO4J_USER);


export const getSession = () => driver.session();
export default driver;