import { Component } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  imports: [
    FormsModule // <-- Add this
  ],
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent {
  contact: Contact = new Contact();

  constructor(private contactService: ContactService) {}

  saveContact() {
    this.contactService.saveContact(this.contact).subscribe(response => {
      console.log('Contact saved successfully', response);
      alert('Contact saved successfully!');
    }, error => {
      console.error('Error saving contact', error);
    });
  }

  onSubmit() { 
    this.saveContact(); // Call the save method
  }
}
