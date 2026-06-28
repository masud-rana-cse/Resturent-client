import { useState } from "react";
import { FaHeart, FaPlus, FaRegCheckCircle, FaStar } from "react-icons/fa";
import { useCart } from "../../context/CartContext";

export default function DishCard({ dish }) {
  //   const { addItem } = useCart();
  //   const { isFavorited, toggleFavorite } = useFavorites();
  //   const { showToast } = useToast();
  const [added, setAdded] = useState(false);

  //   const favorited = isFavorited(dish.id);
  const favorited = [];
  const { addItem } = useCart();

  function handleAddToCart() {
    addItem(dish);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  }

  function handleToggleFavorite() {
    // toggleFavorite({
    //   dishId: dish.id,
    //   dishName: dish.name,
    //   dishImage: dish.image,
    //   dishPrice: dish.price,
    // });
  }

  return (
    <div className="relative bg-white rounded-[20px] p-4 shadow-card hover:-translate-y-1 transition-transform duration-300">
      {/* Rating badge */}
      <div className="absolute top-6 left-6 bg-white rounded-full px-3 py-1 text-xs font-semibold shadow-card flex items-center gap-1">
        ({dish.rating}) <FaStar className="fas fa-star text-(--primary-500)" />
      </div>

      {/* Favorite button */}
      <button
        onClick={handleToggleFavorite}
        className={`absolute top-6 right-6 text-xl transition-colors duration-300 cursor-pointer
          ${favorited ? "text-red-500" : "text-(--neutral-300) hover:text-(--primary-500)"}`}
        aria-label="Toggle favorite"
      >
        <FaHeart className="fas fa-heart" />
      </button>

      {/* Dish image */}
      <div className="h-50 lg:h-60">
        <img
          src={dish?.image}
          alt={dish.name}
          className="object-cover h-full w-full rounded-2xl"
        />
      </div>

      <h3 className="text-lg font-bold text-(--secondary-500) mb-1">
        {dish.name}
      </h3>
      <div className="text-2xl font-bold text-(--primary-500) mb-1">
        ${dish.price.toFixed(2)}
      </div>
      <p className="text-(--neutral-600) text-sm leading-relaxed mb-4">
        {dish.description}
      </p>

      <button
        onClick={handleAddToCart}
        className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold
          transition-all duration-300 text-white bg-(--primary-500) hover:bg-(--primary-600) hover:scale-105 cursor-pointer 
          ${added ? " scale-105" : ""}`}
      >
        {added ? (
          <FaRegCheckCircle className="w-5 h-5" />
        ) : (
          <FaPlus className={`fas ${added ? "fa-check" : "fa-plus"}`} />
        )}
        {added ? "Added!" : "Add to Cart"}
      </button>
    </div>
  );
}
