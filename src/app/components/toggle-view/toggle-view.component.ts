import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toggle-view',
  standalone: true,
  imports: [CommonModule], // Ensure CommonModule is imported
  templateUrl: './toggle-view.component.html',
  styleUrls: ['./toggle-view.component.css']
})
export class ToggleViewComponent {
  viewMode: string = 'grid';

  toggleView() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }
}
