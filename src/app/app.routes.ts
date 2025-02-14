import { Routes } from '@angular/router';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';

export const routes: Routes = [
  { path: 'contacts', component: ContactListComponent },
  { path: 'add-contact', component: ContactFormComponent },
  { path: '', redirectTo: '/add-contact', pathMatch: 'full' } // Default route
];