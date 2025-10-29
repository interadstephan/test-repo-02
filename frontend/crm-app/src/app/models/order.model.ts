export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  orderNumber: string;
  orderDate: Date;
  totalAmount: number;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateOrderDto {
  customerId: number;
  orderDate: Date;
  totalAmount: number;
  status: string;
  notes?: string;
}

export interface UpdateOrderDto {
  orderDate: Date;
  totalAmount: number;
  status: string;
  notes?: string;
}
