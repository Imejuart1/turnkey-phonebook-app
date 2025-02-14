import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleViewComponent } from '../toggle-view/toggle-view.component';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';

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
  showFavorites: boolean = false;
  constructor(private contactService: ContactService, private cdr: ChangeDetectorRef , private http: HttpClient) {}


  loadContacts() {
    this.contactService.getContacts().subscribe(
      (data) => {
        this.contacts = data.map(contact => ({
          ...contact,
          firstName: contact.firstName || 'Unknown', // Replace null with default value
          lastName: contact.lastName || 'Unknown',
        }));
  
        this.filteredContacts = [...this.contacts];
        this.contactgroupTypes = [...new Set(data.map(c => c.groupType).filter(g => g))];
  
        // Check if localStorage is available
        let favorites: Record<string, boolean> = {};
        if (typeof localStorage !== 'undefined' && localStorage.getItem('favorites')) {
          favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
        }
  
        this.contacts.forEach(contact => {
          if (contact.id) {
            contact.isFavorite = !!favorites[contact.id]; 
          }
        });
  
        this.cdr.detectChanges();
      },
      (error) => console.error('Error fetching contacts:', error)
    );
  }
  


  ngOnInit() {
    this.loadContacts();
  
    // ✅ Check if localStorage is available before using it
    if (typeof localStorage !== 'undefined') {
      const savedContacts = localStorage.getItem('contacts');
      if (savedContacts) {
        this.contacts = JSON.parse(savedContacts);
        this.filteredContacts = [...this.contacts]; 
      }
  
      const savedView = localStorage.getItem('contactViewMode');
      if (savedView) {
        this.viewMode = savedView;
      }
    }
  
    this.filterContacts();
  }
  
  setViewMode(mode: string) {
    this.viewMode = mode;
  }
  isEmailValid: boolean = true;
  isPhoneValid: boolean = true;
  toggleFavorite(contact: any) {
    contact.isFavorite = !contact.isFavorite;
    
    // Get existing favorites from local storage
    let favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
  
    // Update the favorite status
    if (contact.isFavorite) {
      favorites[contact.id] = true; // Assuming each contact has a unique ID
    } else {
      delete favorites[contact.id];
    }
  
    // Save updated favorites to local storage
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
  
  saveContactsToLocalStorage() {
    console.log("Saving contacts:", this.contacts); // Debugging log
    if (typeof localStorage !== 'undefined') {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }
  }
  
  
  validateEmail() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isEmailValid = emailRegex.test(this.selectedContact?.email || '');
  }
  
  validatePhoneNumber() {
    this.isPhoneValid = (this.selectedContact?.phoneNumber?.length ?? 0) >= 10;
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
      (!this.selectedgroupType || contact.groupType === this.selectedgroupType) &&
      (!this.showFavorites || contact.isFavorite) 
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

exportContacts() {
  const csvData = this.convertToCSV(this.contacts);
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'contacts.csv';
  a.click();
  window.URL.revokeObjectURL(url);
}

convertToCSV(contacts: Contact[]): string {
  const headers = ['First Name,Last Name,Email,Phone Number,Address,Group Type,Image URL'];
  const rows = contacts.map((contact) =>
    `${contact.firstName},${contact.lastName},${contact.email},${contact.phoneNumber},${contact.physicalAddress},${contact.groupType},${contact.contactImage || ''}`
  );
  return headers.concat(rows).join('\n');
}

importContacts(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  const reader = new FileReader();
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  reader.onload = (e: any) => {
    let contacts: any[] = [];

    if (fileExtension === 'xlsx') {
      // ** Process XLSX File **
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      contacts = XLSX.utils.sheet_to_json(sheet);
    } else if (fileExtension === 'csv') {
      // ** Process CSV File **
      const csvData = e.target.result as string;
      const parsedCSV = XLSX.read(csvData, { type: 'string' });

      const sheetName = parsedCSV.SheetNames[0];
      const sheet = parsedCSV.Sheets[sheetName];

      contacts = XLSX.utils.sheet_to_json(sheet);
    } else {
      alert('Invalid file format. Please upload a CSV or XLSX file.');
      return;
    }

    console.log('Parsed contacts:', contacts);

    const validContacts: Contact[] = contacts
  .map(contact => {
    try {
      const normalizedContact: any = {};
      Object.keys(contact).forEach(key => {
        const normalizedKey = key.toLowerCase().replace(/\s+/g, '');
        normalizedContact[normalizedKey] = contact[key];
      });

      const cleanedContact: Contact = {
        id: 0, // Backend assigns ID
        firstName: normalizedContact.firstname && typeof normalizedContact.firstname === 'string' ? normalizedContact.firstname.trim() : "Unknown",
        lastName: normalizedContact.lastname && typeof normalizedContact.lastname === 'string' ? normalizedContact.lastname.trim() : "Unknown",
        email: normalizedContact.email && typeof normalizedContact.email === 'string' ? normalizedContact.email.trim() : "",
        phoneNumber: normalizedContact.phonenumber && typeof normalizedContact.phonenumber === 'string' ? normalizedContact.phonenumber.trim() : "",
        physicalAddress: normalizedContact.address && typeof normalizedContact.address === 'string' ? normalizedContact.address.trim() : "",
        groupType: normalizedContact.grouptype && typeof normalizedContact.grouptype === 'string' ? normalizedContact.grouptype.trim() : "General",
        contactImage: normalizedContact.imageurl && typeof normalizedContact.imageurl === 'string' ? normalizedContact.imageurl.trim() : "",
        isFavorite: false // Default value
      };

      return (cleanedContact.phoneNumber || cleanedContact.email) ? cleanedContact : null;
    } catch (error) {
      console.error('Error processing contact:', contact, error);
      return null;
    }
  })
  .filter((contact): contact is Contact => contact !== null);
    if (validContacts.length === 0) {
      alert('No valid contacts found. Please check your file format.');
      return;
    }

    this.contactService.bulkSaveContacts(validContacts).subscribe(
      () =>  {
        alert('Contacts imported successfully!');
        this.loadContacts(); // 🔄 Update UI immediately after import
      },
      (error: any) => {
        console.error('Error saving contacts:', error);
        alert('Error saving contacts');
      }
    );
  };

  if (fileExtension === 'xlsx') {
    reader.readAsArrayBuffer(file);
  } else {
    reader.readAsText(file);
  }
}


// Download example format
downloadTemplate() {
  const sampleData = [
    ['First Name', 'Last Name', 'Email', 'Phone Number', 'Address', 'Group Type'],
    ['John', 'Doe', 'john.doe@example.com', '1234567890', '123 Street', 'Friends']
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts Template');

  XLSX.writeFile(workbook, 'contacts_template.xlsx');
}
}
