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
        contacts
          .map(contact => ({
            ...contact,
            firstName: contact.firstName || 'Unknown', // Prevent null
            lastName: contact.lastName || 'Unknown'
          }))
          .sort((a, b) => {
            const nameA = a.firstName.toLowerCase();
            const nameB = b.firstName.toLowerCase();
            return nameA.localeCompare(nameB);
          })
      )
    );
  }
  bulkSaveContacts(contacts: Contact[]): Observable<Contact[]> {
    return this.http.post<Contact[]>(`${this.apiUrl}/bulk`, contacts);
  }

  deleteContact(contactId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${contactId}`);
  }
  
  updateContact(id: number, contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, contact);
  }
  
}
