import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleViewComponent } from '../toggle-view/toggle-view.component';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, ToggleViewComponent], // Import ToggleViewComponent
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent {
  viewMode: string = 'grid';// Default view

  contacts = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      image: 'https://via.placeholder.com/150'
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '987-654-3210',
      image: 'https://via.placeholder.com/150'
    }
  ];

  toggleView(mode: string) {
    this.viewMode = mode;
  }
}
