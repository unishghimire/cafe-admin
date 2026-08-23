export type MenuCategory =
  | "all"
  | "hot_beverages"
  | "cold_brews"
  | "breakfast"
  | "main_course"
  | "soups_salads"
  | "desserts";

export interface CustomOptionGroup {
  id: string;
  name: string;
  required?: boolean;
  options: {
    id: string;
    name: string;
    price: number;
    default?: boolean;
  }[];
}

export interface MenuItem {
  id: string;
  name: string;
  nepaliName?: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  isVeg: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isChefSpecial?: boolean;
  isPopular?: boolean;
  preparationTimeMinutes: number;
  calories?: number;
  rating: number;
  reviewsCount: number;
  available: boolean;
  customOptions?: CustomOptionGroup[];
  ingredients?: string[];
  allergens?: string[];
}

export interface SelectedCustomOption {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  item: MenuItem;
  quantity: number;
  selectedOptions: SelectedCustomOption[];
  notes?: string;
  unitPrice: number;
  totalPrice: number;
}

export type TableStatus = "available" | "occupied" | "reserved" | "cleaning";
export type TableSection = "indoor_main" | "barista_counter" | "terrace_veranda" | "private_lounge";
export type TableShape = "round" | "rect" | "square" | "booth";

export interface TableItem {
  id: number;
  tableNumber: number;
  label: string;
  capacity: number;
  section: TableSection;
  shape: TableShape;
  status: TableStatus;
  position: {
    x: number;
    y: number;
    width?: number;
    height?: number;
  };
  currentGuestName?: string;
  guestCount?: number;
  reservedTime?: string;
  reservedBy?: string;
  reservedPhone?: string;
  activeOrderId?: string;
  occupiedSince?: string;
}

export type OrderStatus = "pending" | "preparing" | "served" | "paid" | "cancelled";

export interface CafeOrder {
  id: string;
  orderNumber: string;
  tableNumber: number;
  guestName?: string;
  items: CartItem[];
  subtotal: number;
  serviceCharge: number;
  vat: number;
  grandTotal: number;
  status: OrderStatus;
  paymentMethod: "Fonepay QR" | "Cash" | "Credit Card" | "Pay at Counter";
  customerNotes?: string;
  createdAt: string;
  estimatedMinutes: number;
}

export interface TableReservation {
  id: string;
  tableNumber: number;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  guestCount: number;
  date: string;
  time: string;
  specialRequests?: string;
  status: "confirmed" | "seated" | "cancelled";
  createdAt: string;
}
