import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private readonly STORAGE_KEY = 'idea-nebula-categories';
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  constructor() {
    this.loadFromStorage();
    this.initializeDefaultCategories();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const categories = JSON.parse(stored).map((cat: any) => ({
          ...cat,
          createdAt: new Date(cat.createdAt)
        }));
        this.categoriesSubject.next(categories);
      } catch (error) {
        console.error('Error loading categories from storage:', error);
        this.initializeDefaultCategories();
      }
    }
  }

  private initializeDefaultCategories(): void {
    const currentCategories = this.categoriesSubject.value;
    if (currentCategories.length === 0) {
      const defaultCategories: Category[] = [
        { id: '1', title: 'Stellar', color: '#667eea', createdAt: new Date() },
        { id: '2', title: 'Cosmic', color: '#764ba2', createdAt: new Date() },
        { id: '3', title: 'Galactic', color: '#f093fb', createdAt: new Date() },
        { id: '4', title: 'Nebular', color: '#4facfe', createdAt: new Date() }
      ];
      this.categoriesSubject.next(defaultCategories);
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    const categories = this.categoriesSubject.value;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categories));
  }

  addCategory(title: string, color: string): Category {
    const currentCategories = this.categoriesSubject.value;
    const newCategory: Category = {
      id: this.generateId(),
      title,
      color,
      createdAt: new Date()
    };

    const updatedCategories = [...currentCategories, newCategory];
    this.categoriesSubject.next(updatedCategories);
    this.saveToStorage();
    return newCategory;
  }

  updateCategory(id: string, updates: Partial<Category>): void {
    const currentCategories = this.categoriesSubject.value;
    const updatedCategories = currentCategories.map(category =>
      category.id === id ? { ...category, ...updates } : category
    );
    this.categoriesSubject.next(updatedCategories);
    this.saveToStorage();
  }

  deleteCategory(id: string): void {
    const currentCategories = this.categoriesSubject.value;
    const filteredCategories = currentCategories.filter(category => category.id !== id);
    this.categoriesSubject.next(filteredCategories);
    this.saveToStorage();
  }

  getCategoryById(id: string | null): Category | null {
    if (!id) return null;
    return this.categoriesSubject.value.find(cat => cat.id === id) || null;
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}