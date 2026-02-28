export interface RestaurantInfo {
  id?: number; // Primary key, usually 1
  name: string;
  tagline: string;
  logo_url: string;
  show_veg_filter?: boolean;
  show_sold_out?: boolean;
  show_search?: boolean;
  show_qr_logo?: boolean;
}

export interface Category {
  id: string; // UUID or custom string like 'cat-1'
  name: string;
  order_index: number;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  item_type: 'veg' | 'nonveg';
  available: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
}
