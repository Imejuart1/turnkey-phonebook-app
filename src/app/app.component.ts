import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule } from '@angular/forms'; 
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports:  [ NavbarComponent, FormsModule, RouterOutlet], // Import all components
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'turnkey-phonebook-app';
}
