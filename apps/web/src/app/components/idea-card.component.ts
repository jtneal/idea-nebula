import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../models/category.model';
import { Idea } from '../models/idea.model';

@Component({
  selector: 'app-idea-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="idea-card"
      [style.border-left]="
        category
          ? '4px solid ' + category.color
          : '4px solid rgba(255,255,255,0.3)'
      "
      [style.background]="getCardBackground()"
    >
      <div class="card-header">
        <div
          class="category-badge"
          [style.background-color]="category?.color || 'rgba(255, 255, 255, 0.2)'"
        >
          {{ category?.title || 'Uncategorized' }}
        </div>
        <button class="delete-btn" (click)="onDelete()" title="Delete idea">
          &times;
        </button>
      </div>

      <div
        *ngIf="!isEditing"
        class="view-mode"
        (click)="startEditing()"
        (keydown.enter)="startEditing()"
        tabindex="0"
      >
        <h3 class="idea-title">{{ idea.title || 'Untitled Idea' }}</h3>
        <div class="idea-description">{{ idea.description }}</div>
        <div class="idea-meta">
          <small>Created: {{ formatDate(idea.createdAt) }}</small>
          <small *ngIf="idea.updatedAt.getTime() !== idea.createdAt.getTime()">
            Updated: {{ formatDate(idea.updatedAt) }}
          </small>
        </div>
      </div>

      <div *ngIf="isEditing" class="edit-mode">
        <input
          [(ngModel)]="editTitle"
          placeholder="Idea title..."
          class="title-input"
          #titleInput
        />
        <textarea
          [(ngModel)]="editDescription"
          placeholder="Describe your idea..."
          class="description-input"
          rows="3"
        ></textarea>

        <select [(ngModel)]="editCategoryId" class="category-select">
          <option value="">Uncategorized</option>
          <option *ngFor="let cat of categories" [value]="cat.id">
            {{ cat.title }}
          </option>
        </select>

        <div class="edit-actions">
          <button class="save-btn" (click)="saveChanges()">Save</button>
          <button class="cancel-btn" (click)="cancelEditing()">Cancel</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .idea-card {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 16px;
        cursor: move;
        padding: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
        position: relative;
        min-height: 160px;
        overflow: hidden;
        height: 100%;
      }

      .idea-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.1) 0%,
          rgba(255, 255, 255, 0.05) 100%
        );
        pointer-events: none;
      }

      .idea-card:hover {
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        transform: translateY(-4px);
        border-color: rgba(255, 255, 255, 0.4);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        position: relative;
        z-index: 2;
      }

      .category-badge {
        color: white;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      .delete-btn {
        background: linear-gradient(135deg, #ff6b6b, #ee5a52);
        color: white;
        border: none;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: top;
        justify-content: center;
        transition: all 0.3s ease;
        box-shadow: 0 2px 10px rgba(255, 107, 107, 0.4);
      }

      .delete-btn:hover {
        background: linear-gradient(135deg, #ff5252, #d32f2f);
        transform: scale(1.1);
        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.6);
      }

      .view-mode {
        cursor: pointer;
        position: relative;
        z-index: 2;
      }

      .idea-title {
        font-size: 18px;
        font-weight: 600;
        margin: 0 0 12px 0;
        color: white;
        line-height: 1.4;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
      }

      .idea-description {
        color: rgba(255, 255, 255, 0.8);
        line-height: 1.6;
        margin: 0 0 16px 0;
        white-space: pre-wrap;
      }

      .idea-meta {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .idea-meta small {
        color: rgba(255, 255, 255, 0.6);
        font-size: 12px;
      }

      .edit-mode {
        display: flex;
        flex-direction: column;
        gap: 12px;
        position: relative;
        z-index: 2;
      }

      .title-input,
      .description-input,
      .category-select {
        width: 100%;
        padding: 12px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 12px;
        font-size: 14px;
        transition: all 0.3s ease;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        backdrop-filter: blur(10px);
      }

      .title-input::placeholder,
      .description-input::placeholder {
        color: rgba(255, 255, 255, 0.6);
      }

      .title-input:focus,
      .description-input:focus,
      .category-select:focus {
        outline: none;
        border-color: rgba(167, 139, 250, 0.8);
        box-shadow: 0 0 20px rgba(167, 139, 250, 0.3);
      }

      .title-input {
        font-weight: 600;
        font-size: 16px;
      }

      .description-input {
        resize: vertical;
        min-height: 80px;
      }

      .category-select {
        cursor: pointer;
      }

      .category-select option {
        background: #1a1a2e;
        color: white;
      }

      .edit-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }

      .save-btn,
      .cancel-btn {
        padding: 10px 18px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
      }

      .save-btn {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
      }

      .save-btn:hover {
        background: linear-gradient(135deg, #059669, #047857);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
      }

      .cancel-btn {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.8);
        border: 2px solid rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(10px);
      }

      .cancel-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-1px);
      }
    `,
  ],
})
export class IdeaCardComponent implements OnInit {
  @Input() idea!: Idea;
  @Input() category: Category | null = null;
  @Input() categories: Category[] = [];
  @Input() isNew = false;
  @Output() update = new EventEmitter<Partial<Idea>>();
  @Output() delete = new EventEmitter<void>();

  isEditing = false;
  editTitle = '';
  editDescription = '';
  editCategoryId = '';

  ngOnInit() {
    if (this.isNew) {
      this.startEditing();
    }
  }

  getCardBackground(): string {
    if (this.category) {
      return `linear-gradient(135deg, ${this.category.color}15, ${this.category.color}08)`;
    }
    return 'rgba(255, 255, 255, 0.1)';
  }

  startEditing() {
    this.isEditing = true;
    this.editTitle = this.idea.title;
    this.editDescription = this.idea.description;
    this.editCategoryId = this.idea.categoryId || '';
  }

  saveChanges() {
    this.update.emit({
      title: this.editTitle.trim(),
      description: this.editDescription.trim(),
      categoryId: this.editCategoryId || null,
    });
    this.isEditing = false;
  }

  cancelEditing() {
    if (this.isNew && !this.idea.title && !this.idea.description) {
      this.delete.emit();
    } else {
      this.isEditing = false;
      this.editTitle = this.idea.title;
      this.editDescription = this.idea.description;
      this.editCategoryId = this.idea.categoryId || '';
    }
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this idea?')) {
      this.delete.emit();
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
