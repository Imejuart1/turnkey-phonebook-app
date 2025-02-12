import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleViewComponent } from '../toggle-view/toggle-view.component';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, ToggleViewComponent],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
  viewMode: string = 'grid';
  contacts: Contact[] = [];
  selectedContact: Contact | null = null;

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.contactService.getContacts().subscribe(
      (data) => {
        this.contacts = data;
      },
      (error) => {
        console.error('Error fetching contacts:', error);
      }
    );
  }

  toggleView(viewMode: string) {
    this.viewMode = viewMode;
  }

  openModal(contact: Contact) {
    this.selectedContact = contact;
  }
  editContact(contact: Contact) {
    this.selectedContact = contact;
  }
  deleteContact(contact: Contact) {
    this.selectedContact = contact;
  }
  closeModal() {
    this.selectedContact = null;
  }

  getInitials(firstName: string, lastName: string): string {
    return (firstName ? firstName[0] : '') + (lastName ? lastName[0] : '');
  }
  
}
