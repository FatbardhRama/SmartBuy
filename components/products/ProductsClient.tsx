"use client";


import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import ProductsGrid from "./ProductsGrid";



type Product = {

  id: string;

  name: string;

  description: string;

  price: number;

  image: string;

  category: string;

};



type ProductsClientProps = {

  products: Product[];

  initialTotalPages: number;

};





const categories = [

  "All",

  "Laptops",

  "Smartphones",

  "Tablets",

  "Monitors",

  "Headphones",

  "Accessories",

];







export default function ProductsClient({

  products,

  initialTotalPages,

}: ProductsClientProps) {



  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [sort, setSort] = useState("newest");

  const [page, setPage] = useState(1);


  const [totalPages, setTotalPages] =
    useState(initialTotalPages);



  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(products);



  const [loading, setLoading] =
    useState(false);






  useEffect(() => {


    const timeout = setTimeout(async () => {


      try {


        setLoading(true);



        const params =
          new URLSearchParams();




        if (search) {

          params.append(
            "search",
            search
          );

        }




        if (category !== "All") {

          params.append(
            "category",
            category
          );

        }




        if (sort !== "newest") {

          params.append(
            "sort",
            sort
          );

        }





        params.append(
          "page",
          page.toString()
        );



        params.append(
          "limit",
          "12"
        );





        const res = await fetch(
          `/api/products?${params.toString()}`
        );



        const data = await res.json();




        setFilteredProducts(
          data.products
        );



        setTotalPages(
          data.totalPages
        );




      } catch {


        setFilteredProducts([]);



      } finally {


        setLoading(false);


      }



    }, 500);




    return () =>
      clearTimeout(timeout);




  }, [

    search,

    category,

    sort,

    page,

  ]);







  return (

    <>


      <div className="mb-8 flex flex-col gap-4 md:flex-row">



        <div className="relative max-w-md flex-1">


          <Search

            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"

          />



          <Input

            placeholder="Search products..."

            value={search}


            onChange={(e) => {

              setSearch(
                e.target.value
              );

              setPage(1);

            }}


            className="pl-10"

          />


        </div>





        <select

          value={category}


          onChange={(e) => {

            setCategory(
              e.target.value
            );

            setPage(1);

          }}


          className="rounded-md border px-3 py-2"

        >


          {categories.map((item) => (

            <option
              key={item}
              value={item}
            >

              {item}

            </option>

          ))}


        </select>






        <select

          value={sort}


          onChange={(e) => {

            setSort(
              e.target.value
            );

            setPage(1);

          }}


          className="rounded-md border px-3 py-2"

        >



          <option value="newest">
            Newest
          </option>


          <option value="price-low">
            Price: Low to High
          </option>


          <option value="price-high">
            Price: High to Low
          </option>


          <option value="name-a">
            Name: A-Z
          </option>


          <option value="name-z">
            Name: Z-A
          </option>



        </select>



      </div>






      {loading && (

        <p className="mb-4 text-sm text-muted-foreground">

          Loading products...

        </p>

      )}






      <ProductsGrid

        products={filteredProducts}

      />







      <div className="mt-10 flex justify-center gap-2">



        <button

          disabled={page === 1}

          onClick={() =>
            setPage(page - 1)
          }

          className="rounded-md border px-4 py-2 disabled:opacity-50"

        >

          Previous

        </button>






        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        ).map((number) => (


          <button

            key={number}


            onClick={() =>
              setPage(number)
            }


            className={`rounded-md border px-3 py-2 ${
              page === number
                ? "bg-black text-white"
                : ""
            }`}


          >

            {number}

          </button>


        ))}






        <button

          disabled={page === totalPages}


          onClick={() =>
            setPage(page + 1)
          }


          className="rounded-md border px-4 py-2 disabled:opacity-50"

        >

          Next

        </button>



      </div>



    </>

  );

}