import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';
import { map } from 'rxjs/operators'; // Import map operator

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'https://turnkeyapp-contactbackend.onrender.com/api/contacts';

  constructor(private http: HttpClient) {}

  saveContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact);
  }

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl).pipe(
      map(contacts => 
        contacts.sort((a, b) => {
          const nameA = a.firstName ?? ''; // Ensure it’s never null
          const nameB = b.firstName ?? '';
          return nameA.localeCompare(nameB);
        })
      )
    );
  }

  deleteContact(contactId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${contactId}`);
  }
  
  updateContact(id: number, contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, contact);
  }
  
}
