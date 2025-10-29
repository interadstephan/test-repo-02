import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  displayedColumns: string[] = ['id', 'orderNumber', 'customerName', 'orderDate', 'totalAmount', 'status', 'actions'];

  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAll().subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (error) => {
        this.snackBar.open('Error loading orders', 'Close', { duration: 3000 });
        console.error('Error loading orders:', error);
      }
    });
  }

  deleteOrder(id: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Order deleted successfully', 'Close', { duration: 3000 });
          this.loadOrders();
        },
        error: (error) => {
          this.snackBar.open('Error deleting order', 'Close', { duration: 3000 });
          console.error('Error deleting order:', error);
        }
      });
    }
  }
}
