export type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
};


export type Order = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};