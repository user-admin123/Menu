import { useRef } from "react";
import { RestaurantInfo } from "@/lib/types";
import { UtensilsCrossed } from "lucide-react";

interface Props {
  restaurant: RestaurantInfo;
  onAdminClick?: () => void; // trigger login modal
}

const RestaurantHeader = ({ restaurant, onAdminClick }: Props) => {
  const clickCount = useRef(0);

  const handleClick = () => {
    clickCount.current += 1;

    if (clickCount.current >= 3) { // tapped 3 times
      clickCount.current = 0; // reset
      if (onAdminClick) onAdminClick();
    }

    // reset after 2 seconds of no clicks
    setTimeout(() => {
      clickCount.current = 0;
    }, 2000);
  };

  return (
    <header className="relative pt-12 pb-8 px-6 text-center">
      {/* Decorative gradient orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        {/* Logo or fallback icon */}
        <div onClick={handleClick} className="cursor-pointer inline-block">
          {restaurant.logo_url ? (
            <img
              src={restaurant.logo_url}
              alt={restaurant.name}
              className="w-20 h-20 mx-auto mb-4 rounded-full object-cover border-2 border-primary/30"
            />
          ) : (
            <div className="w-20 h-20 mx-auto mb-4 rounded-full glass-card flex items-center justify-center border-2 border-primary/30">
              <UtensilsCrossed className="w-9 h-9 text-primary" />
            </div>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
          {restaurant.name}
        </h1>
        {restaurant.tagline && (
          <p className="mt-2 text-muted-foreground text-lg italic tracking-wide">
            {restaurant.tagline}
          </p>
        )}
      </div>
    </header>
  );
};

export default RestaurantHeader;
