import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule } from '@angular/forms'; 
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, FormsModule, RouterOutlet], // Import all components
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'turnkey-phonebook-app';
  isDarkMode: boolean = false; // Track theme mode

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {  // ✅ Check if it's available
      const savedTheme = localStorage.getItem('theme');
      this.isDarkMode = savedTheme === 'dark';
      this.applyTheme();
    }
  }
  
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }
    this.applyTheme();
  }

  applyTheme() {
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'bg-dark');
      this.renderer.addClass(document.body, 'text-light');
    } else {
      this.renderer.removeClass(document.body, 'bg-dark');
      this.renderer.removeClass(document.body, 'text-light');
    }
  }
}
