import { useRef, useState } from "react";
import DishCard from "../Dishes/DishCard";
import { FOOD_DATA } from "../../@libs/data/dishData";
import { useEffect } from "react";
import { AxiosInstance } from "../../AxiosInstance/AxiosInstance";
import BaseLoader from "../../@base/BaseLoader";
import { Link } from "react-router-dom";

export default function MenuSection() {
  const headerRef = useRef(null);
  const carouselRef = useRef(null);
  const carouselIndex = useRef(0);
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
                {dishes?.slice(0, 3).map((dish) => (
                  <DishCard key={dish._id} dish={dish} />
                ))}
              </div>
            )}
          </>
        )}
        {dishes?.length > 3 && (
          <div className="mt-10 flex justify-center">
            <Link
              to="/menu"
              className="inline-flex items-center rounded-full bg-(--primary-500) px-6 py-3 text-white font-semibold transition hover:bg-(--primary-600)"
            >
              View More
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
