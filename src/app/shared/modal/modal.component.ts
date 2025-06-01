import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() open = false;
  @Input() title = 'Title';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  @Input() noFooter = false;

  @Output() openChange = new EventEmitter<boolean>();
  @Output() confirmed = new EventEmitter<void>();
  @Output() canceled = new EventEmitter<void>();
  
  isOpen = false;

  ngOnChanges() {
    this.isOpen = this.open;
  }
  
  openModal() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.openChange.emit(this.isOpen);
  }

  confirm() {
    this.isOpen = false;
    this.openChange.emit(this.isOpen);
    this.confirmed.emit();
  }
  
  cancel(event?: Event) {
    if (event) event.stopPropagation();
    this.isOpen = false;
    this.openChange.emit(this.isOpen);
    this.canceled.emit();
  }
}
