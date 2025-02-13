import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent {
  @Output() themeToggle = new EventEmitter<void>();
  constructor(private router: Router) {}
  navigate(route: string) {
    this.router.navigate([route]);
  }

  toggleTheme() {
    this.themeToggle.emit();
  }
 }
