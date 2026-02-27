export interface User {
  id: number;
  email: string;
  password: string;
}

export interface RestaurantInfo {
  id: number;
  owner_id: number;
  name: string;
  tagline: string;
  logo_url: string;
  show_veg_filter?: boolean;
  show_sold_out?: boolean;
  show_search?: boolean;
  show_qr_logo?: boolean;
}

export interface Category {
  id: number;
  restaurant_id: number;
  name: string;
  position: number;
}

export type ItemType = "veg" | "nonveg";

export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image_url: string;
  item_type: ItemType;
  position: number;
}
