import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleViewComponent } from '../toggle-view/toggle-view.component';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ToggleViewComponent],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
  viewMode: string = 'grid';
  contacts: Contact[] = [];
  selectedContact: Contact | null = null;
  searchQuery: string = '';
  filteredContacts: Contact[] = [];
  selectedgroupType: string = '';
  contactgroupTypes: string[] = [];
  isDropdownOpen = false;

  constructor(private contactService: ContactService, private cdr: ChangeDetectorRef) {}

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectGroup(groupType: string) {
    this.selectedgroupType = groupType;
    this.isDropdownOpen = false; // Close dropdown after selection
    this.filterContacts();
  }

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.contactService.getContacts().subscribe(
      (data) => {
        this.contacts = data;
        this.filteredContacts = data;
        this.contactgroupTypes = [...new Set(data.map(c => c.groupType).filter(g => g))]; // Extract unique groupTypes
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      (error) => console.error('Error fetching contacts:', error)
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

  filterContacts() {
    const query = this.searchQuery.toLowerCase();
    
    this.filteredContacts = this.contacts.filter(contact => 
      (contact.firstName.toLowerCase().includes(query) || 
       contact.lastName.toLowerCase().includes(query) ||
       contact.email.toLowerCase().includes(query) ||
       contact.phoneNumber.toLowerCase().includes(query)) &&
      (!this.selectedgroupType || contact.groupType === this.selectedgroupType) // ✅ Fixed Condition
    );
  }
}