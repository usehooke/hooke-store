import { getProducts } from "./lib/productService";

async function run() {
    console.log("Fetching products...");
    const prods = await getProducts();
    console.log("Found products:", prods.length);
}

run();
