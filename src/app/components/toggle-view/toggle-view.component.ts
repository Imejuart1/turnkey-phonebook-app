import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-toggle-view',
  imports: [CommonModule],
  template: `
    <button class="btn btn-outline-primary me-2" (click)="toggleView()">
      <i [ngClass]="viewMode === 'grid' ? 'bi bi-list' : 'bi bi-grid'"></i>
      {{ viewMode === 'grid' ? 'List View' : 'Grid View' }}
    </button>
  `
})
export class ToggleViewComponent implements OnInit {
  @Output() viewModeChanged = new EventEmitter<string>();
  viewMode: string = 'grid'; // Default view
  ngOnInit() {
    if (typeof localStorage !== 'undefined') {  // ✅ Prevents SSR error
      const savedView = localStorage.getItem('contactViewMode');
      if (savedView) {
        this.viewMode = savedView;
      }
    }
    this.viewModeChanged.emit(this.viewMode);
  }
  
  toggleView() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
    
    if (typeof localStorage !== 'undefined') {  // ✅ Prevents SSR error
      localStorage.setItem('contactViewMode', this.viewMode); 
    }
    
    this.viewModeChanged.emit(this.viewMode);
  }
  
}
