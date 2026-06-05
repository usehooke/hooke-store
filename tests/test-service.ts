import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
  const { getFilteredProducts } = await import('./src/lib/productService.js');
  console.log("Testing getFilteredProducts...");
  const prods = await getFilteredProducts({ department: "masculino" });
  console.log("Products count:", prods.length);
  if (prods.length > 0) {
    console.log("First product:", prods[0].name);
  } else {
    console.log("No products returned!");
  }
}

test();

