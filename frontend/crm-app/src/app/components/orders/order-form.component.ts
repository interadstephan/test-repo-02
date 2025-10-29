import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrderService } from '../../services/order.service';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {
  orderForm: FormGroup;
  isEditMode = false;
  orderId?: number;
  customers: Customer[] = [];
  statuses = ['Pending', 'Processing', 'Completed', 'Cancelled'];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.orderForm = this.fb.group({
      customerId: ['', Validators.required],
      orderDate: [new Date(), Validators.required],
      totalAmount: ['', [Validators.required, Validators.min(0)]],
      status: ['Pending', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.orderId = +id;
      this.loadOrder(this.orderId);
    }
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (error) => {
        this.snackBar.open('Error loading customers', 'Close', { duration: 3000 });
        console.error('Error loading customers:', error);
      }
    });
  }

  loadOrder(id: number): void {
    this.orderService.getById(id).subscribe({
      next: (order) => {
        this.orderForm.patchValue({
          customerId: order.customerId,
          orderDate: new Date(order.orderDate),
          totalAmount: order.totalAmount,
          status: order.status,
          notes: order.notes
        });
      },
      error: (error) => {
        this.snackBar.open('Error loading order', 'Close', { duration: 3000 });
        console.error('Error loading order:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      const formData = this.orderForm.value;

      if (this.isEditMode && this.orderId) {
        const updateData = {
          orderDate: formData.orderDate,
          totalAmount: formData.totalAmount,
          status: formData.status,
          notes: formData.notes
        };
        
        this.orderService.update(this.orderId, updateData).subscribe({
          next: () => {
            this.snackBar.open('Order updated successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/orders']);
          },
          error: (error) => {
            this.snackBar.open('Error updating order', 'Close', { duration: 3000 });
            console.error('Error updating order:', error);
          }
        });
      } else {
        this.orderService.create(formData).subscribe({
          next: () => {
            this.snackBar.open('Order created successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/orders']);
          },
          error: (error) => {
            this.snackBar.open('Error creating order', 'Close', { duration: 3000 });
            console.error('Error creating order:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/orders']);
  }
}
