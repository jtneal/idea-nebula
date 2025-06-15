import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CategoryManagerComponent } from './components/category-manager.component';
import { IdeaCardComponent } from './components/idea-card.component';
import { Category } from './models/category.model';
import { Idea } from './models/idea.model';
import { CategoriesService } from './services/categories.service';
import { IdeasService } from './services/ideas.service';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    IdeaCardComponent,
    CategoryManagerComponent,
  ],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly ideasService = inject(IdeasService);
  private readonly categoriesService = inject(CategoriesService);

  ideas: Idea[] = [];
  categories: Category[] = [];
  showCategoryManager = false;
  showDropdown = false;
  showAboutModal = false;
  newIdeaId: string | null = null;
  gridColumns = 3;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.dropdown');

    if (dropdown && !dropdown.contains(target)) {
      this.showDropdown = false;
    }
  }

  ngOnInit() {
    // Load saved grid preference
    const savedColumns = localStorage.getItem('idea-nebula-grid-columns');
    if (savedColumns) {
      this.gridColumns = parseInt(savedColumns, 10);
    }

    this.ideasService.ideas$.subscribe((ideas) => {
      this.ideas = ideas.sort((a, b) => a.priority - b.priority);
    });

    this.categoriesService.categories$.subscribe((categories) => {
      this.categories = categories;
    });
  }

  setGridColumns(columns: number) {
    this.gridColumns = columns;
    localStorage.setItem('idea-nebula-grid-columns', columns.toString());
  }

  addNewIdea() {
    const newIdea = this.ideasService.addIdea('', '');
    this.newIdeaId = newIdea.id;
    setTimeout(() => {
      this.newIdeaId = null;
    }, 100);
  }

  updateIdea(id: string, updates: Partial<Idea>) {
    this.ideasService.updateIdea(id, updates);
  }

  deleteIdea(id: string) {
    this.ideasService.deleteIdea(id);
  }

  onDrop(event: CdkDragDrop<Idea[]>) {
    const reorderedIdeas = [...this.ideas];
    moveItemInArray(reorderedIdeas, event.previousIndex, event.currentIndex);
    this.ideasService.reorderIdeas(reorderedIdeas);
  }

  toggleCategoryManager() {
    this.showCategoryManager = !this.showCategoryManager;
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  addCategory(data: { title: string; color: string }) {
    this.categoriesService.addCategory(data.title, data.color);
  }

  deleteCategory(id: string) {
    this.categoriesService.deleteCategory(id);
    // Update ideas to remove the deleted category
    this.ideas.forEach((idea) => {
      if (idea.categoryId === id) {
        this.updateIdea(idea.id, { categoryId: null });
      }
    });
  }

  getCategoryById(id: string | null): Category | null {
    return this.categoriesService.getCategoryById(id);
  }

  exportData() {
    const data = this.ideasService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `idea-nebula-backup-${
      new Date().toISOString().split('T')[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showDropdown = false;
  }

  importData(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const success = this.ideasService.importData(content);
          if (success) {
            alert('Data imported successfully!');
          } else {
            alert('Failed to import data. Please check the file format.');
          }
        } catch (error) {
          alert("Error reading file. Please ensure it's a valid JSON file.");
        }
      };
      reader.readAsText(file);
    }
    this.showDropdown = false;
    event.target.value = '';
  }

  closeAboutModal(event: Event) {
    if (event.target === event.currentTarget) {
      this.showAboutModal = false;
    }
  }

  trackByIdea(index: number, idea: Idea): string {
    return idea.id;
  }
}
