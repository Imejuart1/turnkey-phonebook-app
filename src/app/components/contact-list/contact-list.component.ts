import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleViewComponent } from '../toggle-view/toggle-view.component';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
  filteredContacts: Contact[] = [];
  selectedContact: Contact | null = null;
  searchQuery: string = '';
  selectedContacts: Contact[] = [];
  selectedgroupType: string = '';
  contactgroupTypes: string[] = [];
  isDropdownOpen = false;
  isEditing = false;
  imageFile: File | null = null; 
  isSaving: boolean = false;
  isSubmitted: boolean = false;
  constructor(private contactService: ContactService, private cdr: ChangeDetectorRef , private http: HttpClient) {}

  ngOnInit() {
    this.loadContacts();
  }
  isEmailValid: boolean = true;
  isPhoneValid: boolean = true;
  
  validateEmail() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isEmailValid = emailRegex.test(this.selectedContact?.email || '');
  }
  
  validatePhoneNumber() {
    this.isPhoneValid = (this.selectedContact?.phoneNumber?.length ?? 0) >= 10;
  }
  loadContacts() {
    this.contactService.getContacts().subscribe(
      (data) => {
        this.contacts = data;
        this.filteredContacts = data;
        this.contactgroupTypes = [...new Set(data.map(c => c.groupType).filter(g => g))];
        this.cdr.detectChanges();
      },
      (error) => console.error('Error fetching contacts:', error)
    );
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectGroup(groupType: string) {
    this.selectedgroupType = groupType;
    this.isDropdownOpen = false;
    this.filterContacts();
  }

  toggleView(viewMode: string) {
    this.viewMode = viewMode;
  }

  openModal(contact: Contact) {
    this.selectedContact = { ...contact }; // Clone contact for safe editing
    this.isEditing = false;
  }

  closeModal() {
    this.selectedContact = null;
    this.isEditing = false;
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
  }
  saveEdit() {
    this.isSubmitted = true;
    if (!this.selectedContact) return;
    this.validateEmail();
    this.validatePhoneNumber();
    if (!this.selectedContact.firstName || !this.selectedContact.lastName ||
      !this.selectedContact.email || !this.selectedContact.phoneNumber ||
      !this.selectedContact.physicalAddress || !this.selectedContact.groupType ||
      !this.isEmailValid || !this.isPhoneValid) {
    alert("Please fix form errors before saving.");
    return;
  }

    if (!this.isValidContact(this.selectedContact)) {
      alert("Invalid contact details!");
      return;
    }
    
    this.isSaving = true;  
    if (this.imageFile) {
      this.uploadImageAndSaveEditedContact();
      this.isSaving = false; 
      this.isSubmitted = false; 
      alert('Contact saved successfully!');
    } else {
      this.updateContactDetails();
      this.isSaving = false;  
      alert('Contact saved successfully!');
    }
  }
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
  
      if (!this.selectedContact) {
        console.error("No contact selected for updating image.");
        return;
      }
  
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        if (this.selectedContact) {
          this.selectedContact.contactImage = reader.result as string; 
          this.uploadImageAndSaveEditedContact();
        }
      };
      reader.readAsDataURL(file);
    }
  }
  
  // Upload image to Cloudinary before updating contact
  uploadImageAndSaveEditedContact() {
    const formData = new FormData();
    formData.append('file', this.imageFile!);
    formData.append('upload_preset', 'ml_default'); // Your Cloudinary preset
  
    this.http.post('https://api.cloudinary.com/v1_1/dcn5ldbde/image/upload', formData)
      .subscribe((response: any) => {
        this.selectedContact!.contactImage = response.secure_url; // Store the new image URL
        this.updateContactDetails(); 
      }, error => {
        console.error('Image upload failed', error);
      });
  }
  
  // Update contact details in the backend
  updateContactDetails() {;
    this.contactService.updateContact(this.selectedContact!.id!, this.selectedContact!).subscribe(updated => {
      const index = this.contacts.findIndex(c => c.id === updated.id);
      if (index !== -1) {
        this.contacts[index] = updated;
        this.filteredContacts = [...this.contacts]; // Update the displayed list
 
      }
      this.imageFile = null; // Reset the image file after updating
      this.closeModal();
    }, error => {
      console.error("Error updating contact:", error);
 
    });
  }
  
  deleteContact(contact: Contact) {
    if (!confirm(`Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`)) return;

    this.contactService.deleteContact(contact.id!).subscribe(() => {
      this.contacts = this.contacts.filter(c => c.id !== contact.id);
      this.filteredContacts = [...this.contacts];
      this.contactgroupTypes = [...new Set(this.contacts.map(c => c.groupType).filter(g => g))];
      this.closeModal();
    }, error => {
      console.error('Error deleting contact:', error);
    });
  }

  filterContacts() {
    const query = this.searchQuery.toLowerCase();
    this.filteredContacts = this.contacts.filter(contact => 
      (contact.firstName.toLowerCase().includes(query) || 
       contact.lastName.toLowerCase().includes(query) ||
       contact.email.toLowerCase().includes(query) ||
       contact.phoneNumber.toLowerCase().includes(query)||
       contact.physicalAddress.toLowerCase().includes(query)) 
       &&
      (!this.selectedgroupType || contact.groupType === this.selectedgroupType)
    );
  }

  toggleSelection(contact: Contact) {
    if (this.selectedContacts.includes(contact)) {
      this.selectedContacts = this.selectedContacts.filter(c => c !== contact);
    } else {
      this.selectedContacts.push(contact);
    }
  }

  bulkDelete() {
    if (!confirm(`Are you sure you want to delete ${this.selectedContacts.length} contacts?`)) return;

    this.selectedContacts.forEach(contact => this.deleteContact(contact));
    this.selectedContacts = [];
  }

  isValidContact(contact: Contact): boolean {
    return /\S+@\S+\.\S+/.test(contact.email) && /^\d{10,15}$/.test(contact.phoneNumber);
  }

  getInitials(firstName: string, lastName: string): string {
    return (firstName ? firstName[0] : '') + (lastName ? lastName[0] : '');
  }
}
