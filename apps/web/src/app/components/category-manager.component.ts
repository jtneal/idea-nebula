import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="category-manager">
      <div class="header">
        <h3>Categories</h3>
        <button class="add-btn" (click)="toggleAddMode()">
          {{ isAddingCategory ? 'Cancel' : '+ Add Category' }}
        </button>
      </div>

      <div *ngIf="isAddingCategory" class="add-category-form">
        <div class="form-row">
          <input
            [(ngModel)]="newCategoryTitle"
            placeholder="Category name..."
            class="category-input"
          />
          <input
            [(ngModel)]="newCategoryColor"
            type="color"
            class="color-input"
          />
          <button class="save-btn" (click)="addCategory()">Save</button>
        </div>
      </div>

      <div class="categories-list">
        <div *ngFor="let category of categories" class="category-item">
          <div class="category-info">
            <div
              class="color-indicator"
              [style.background-color]="category.color"
            ></div>
            <span class="category-title">{{ category.title }}</span>
          </div>
          <button
            class="delete-category-btn"
            (click)="deleteCategory(category.id)"
            title="Delete category"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .category-manager {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        margin-bottom: 24px;
        position: relative;
        overflow: hidden;
      }

      .category-manager::before {
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

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        position: relative;
        z-index: 2;
      }

      .header h3 {
        margin: 0;
        color: white;
        font-size: 18px;
        font-weight: 600;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
      }

      .add-btn {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }

      .add-btn:hover {
        background: linear-gradient(135deg, #5a67d8, #6b46c1);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
      }

      .add-category-form {
        margin-bottom: 16px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        position: relative;
        z-index: 2;
      }

      .form-row {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .category-input {
        flex: 1;
        padding: 12px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 10px;
        font-size: 14px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
      }

      .category-input::placeholder {
        color: rgba(255, 255, 255, 0.6);
      }

      .category-input:focus {
        outline: none;
        border-color: rgba(167, 139, 250, 0.8);
        box-shadow: 0 0 20px rgba(167, 139, 250, 0.3);
      }

      .color-input {
        width: 50px;
        height: 44px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 10px;
        cursor: pointer;
        background: transparent;
      }

      .save-btn {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        border: none;
        padding: 12px 18px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
      }

      .save-btn:hover {
        background: linear-gradient(135deg, #059669, #047857);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
      }

      .categories-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        position: relative;
        z-index: 2;
      }

      .category-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        transition: all 0.3s ease;
      }

      .category-item:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
      }

      .category-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .color-indicator {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.3);
      }

      .category-title {
        font-weight: 500;
        color: white;
        text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
      }

      .delete-category-btn {
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
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        box-shadow: 0 2px 10px rgba(255, 107, 107, 0.4);
      }

      .delete-category-btn:hover {
        background: linear-gradient(135deg, #ff5252, #d32f2f);
        transform: scale(1.1);
        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.6);
      }
    `,
  ],
})
export class CategoryManagerComponent {
  @Input() categories: Category[] = [];
  @Output() addCategoryEvent = new EventEmitter<{
    title: string;
    color: string;
  }>();
  @Output() deleteCategoryEvent = new EventEmitter<string>();

  isAddingCategory = false;
  newCategoryTitle = '';
  newCategoryColor = '#667eea';

  toggleAddMode() {
    this.isAddingCategory = !this.isAddingCategory;
    if (!this.isAddingCategory) {
      this.newCategoryTitle = '';
      this.newCategoryColor = '#667eea';
    }
  }

  addCategory() {
    if (this.newCategoryTitle.trim()) {
      this.addCategoryEvent.emit({
        title: this.newCategoryTitle.trim(),
        color: this.newCategoryColor,
      });
      this.newCategoryTitle = '';
      this.newCategoryColor = '#667eea';
      this.isAddingCategory = false;
    }
  }

  deleteCategory(id: string) {
    if (
      confirm(
        'Are you sure you want to delete this category? Ideas in this category will be uncategorized.'
      )
    ) {
      this.deleteCategoryEvent.emit(id);
    }
  }
}
