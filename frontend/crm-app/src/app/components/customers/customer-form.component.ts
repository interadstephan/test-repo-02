import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  isEditMode = false;
  customerId?: number;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.customerId = +id;
      this.loadCustomer(this.customerId);
    }
  }

  loadCustomer(id: number): void {
    this.customerService.getById(id).subscribe({
      next: (customer) => {
        this.customerForm.patchValue(customer);
      },
      error: (error) => {
        this.snackBar.open('Error loading customer', 'Close', { duration: 3000 });
        console.error('Error loading customer:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const formData = this.customerForm.value;

      if (this.isEditMode && this.customerId) {
        this.customerService.update(this.customerId, formData).subscribe({
          next: () => {
            this.snackBar.open('Customer updated successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/customers']);
          },
          error: (error) => {
            this.snackBar.open('Error updating customer', 'Close', { duration: 3000 });
            console.error('Error updating customer:', error);
          }
        });
      } else {
        this.customerService.create(formData).subscribe({
          next: () => {
            this.snackBar.open('Customer created successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/customers']);
          },
          error: (error) => {
            this.snackBar.open('Error creating customer', 'Close', { duration: 3000 });
            console.error('Error creating customer:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/customers']);
  }
}
