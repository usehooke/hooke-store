import { db } from "../lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import * as fs from 'fs';

async function run() {
    try {
        const productsRef = collection(db, "produtos");
        const q = query(productsRef);
        const snapshot = await getDocs(q);
        fs.writeFileSync("error_log.json", JSON.stringify({ success: true, size: snapshot.size }));
        console.log("Success! size:", snapshot.size);
    } catch (error) {
        const err = error as Error & { code?: string };
        fs.writeFileSync("error_log.json", JSON.stringify({
            message: err.message,
            code: err.code,
            stack: err.stack
        }, null, 2));
        console.log("Error written to file.");
    }
    process.exit(0);
}
run();
