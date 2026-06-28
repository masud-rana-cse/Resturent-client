import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AxiosInstance } from "../../AxiosInstance/AxiosInstance";
import DishCard from "../Dishes/DishCard";
import BaseLoader from "../../@base/BaseLoader";

export default function MenuItems() {
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchDishes = async () => {
      setIsLoading(true);
      try {
        const res = await AxiosInstance.get("/products");
        if (res.data.success) {
          setIsLoading(false);
          setDishes(res.data.data);
        } else {
          setIsLoading(false);
          console.error("Failed to fetch dishes:", res.data.message);
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching dishes:", error);
      }
    };

    fetchDishes();
  }, []);

  return (
    <section id="menu" className="py-24 bg-(--accent-warm) overflow-hidden">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-10 ">
          <h2 className="text-4xl font-extrabold text-(--secondary-500) max-[480px]:text-[1.8rem]">
            Our Popular <span className="text-(--primary-500)">Dishes</span>
          </h2>
        </div>
        {isLoading ? (
          <BaseLoader className={"flex justify-center"} innerClassName={""} />
        ) : (
          <>
            {dishes?.length === 0 ? (
              <p className="text-center text-(--neutral-500) py-16">
                No dishes found.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                {dishes?.map((dish, idx) => (
                  <DishCard key={idx} dish={dish} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
