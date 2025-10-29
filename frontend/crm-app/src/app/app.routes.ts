import { Routes } from '@angular/router';
import { CustomerListComponent } from './components/customers/customer-list.component';
import { CustomerFormComponent } from './components/customers/customer-form.component';
import { OrderListComponent } from './components/orders/order-list.component';
import { OrderFormComponent } from './components/orders/order-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/customers', pathMatch: 'full' },
  { path: 'customers', component: CustomerListComponent },
  { path: 'customers/:id', component: CustomerFormComponent },
  { path: 'orders', component: OrderListComponent },
  { path: 'orders/:id', component: OrderFormComponent }
];
