import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent {
  contact = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    group: ''
  };

  onSubmit() {
    console.log("Contact Saved:", this.contact);
  }
}
