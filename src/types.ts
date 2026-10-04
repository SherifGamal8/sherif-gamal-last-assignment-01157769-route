export interface Category {
  _id: string;
  id?: string;
  name: string;
  slug?: string;
  image?: string;
}

export interface Brand {
  _id: string;
  id?: string;
  name: string;
  slug?: string;
  image?: string;
}

export interface Subcategory {
  _id: string;
  id?: string;
  name: string;
  slug?: string;
  category?: string;
}

export interface Product {
  _id: string;
  id?: string;
  title: string;
  description?: string;
  price: number;
  imageCover: string;
  images?: string[];
  category?: Category;
  brand?: Brand;
  ratingsAverage: number;
  ratingsQuantity?: number;
}

export interface CartItem {
  _id: string;
  count: number;
  price: number;
  product: Product;
}

export interface CartDetails {
  _id: string;
  totalCartPrice: number;
  products: CartItem[];
}

export interface Order {
  _id: string;
  id: number | string;
  totalOrderPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  cartItems: CartItem[];
}
