import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToggleViewComponent } from './components/toggle-view/toggle-view.component';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports:  [ContactFormComponent, NavbarComponent, ToggleViewComponent, ContactListComponent, FormsModule, HttpClientModule], // Import all components
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'turnkey-phonebook-app';
}
