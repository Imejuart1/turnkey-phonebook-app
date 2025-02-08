import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToggleViewComponent } from './components/toggle-view/toggle-view.component';
import { ContactListComponent } from './components/contact-list/contact-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, ToggleViewComponent, ContactListComponent], // Import all components
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'turnkey-phonebook-app';
}
