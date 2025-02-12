import { Component } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent {
  contact: Contact = new Contact();
  imagePreview: string | ArrayBuffer | null = 'assets/default-avatar.png'; // Default avatar
  imageFile: File | null = null;

  constructor(private contactService: ContactService, private http: HttpClient) {}

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  uploadImageAndSaveContact() {
    if (this.imageFile) {
      const formData = new FormData();
      formData.append('file', this.imageFile);
      formData.append('upload_preset', 'ml_default'); // Get from Cloudinary settings

      this.http.post('https://api.cloudinary.com/v1_1/dcn5ldbde/image/upload', formData)
        .subscribe((response: any) => {
          this.contact.contactImage = response.secure_url; // Store Cloudinary image URL
          this.saveContact();
        }, error => {
          console.error('Image upload failed', error);
        });
    } else {
      this.saveContact();
    }
  }

  saveContact() {
    this.contactService.saveContact(this.contact).subscribe(response => {
      console.log('Contact saved successfully', response);
      alert('Contact saved successfully!');
    }, error => {
      console.error('Error saving contact', error);
    });
  }

  onSubmit() { 
    this.uploadImageAndSaveContact();
  }
}
