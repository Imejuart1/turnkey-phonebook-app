import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-view',
  template: `
    <button class="btn btn-primary" (click)="toggle()">
      {{ viewMode === 'grid' ? 'List View' : 'Grid View' }}
    </button>
  `
})
export class ToggleViewComponent {
  @Output() viewModeChanged = new EventEmitter<string>();
  viewMode: string = 'grid';

  toggle() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
    this.viewModeChanged.emit(this.viewMode);
  }
}
