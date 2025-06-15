import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Idea } from '../models/idea.model';

@Injectable({
  providedIn: 'root',
})
export class IdeasService {
  private readonly STORAGE_KEY = 'idea-nebula-data';
  private ideasSubject = new BehaviorSubject<Idea[]>([]);
  public ideas$ = this.ideasSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const ideas =
          data.ideas?.map((idea: any) => ({
            ...idea,
            createdAt: new Date(idea.createdAt),
            updatedAt: new Date(idea.updatedAt),
          })) || [];
        this.ideasSubject.next(ideas);
      } catch (error) {
        console.error('Error loading ideas from storage:', error);
        this.ideasSubject.next([]);
      }
    }
  }

  private saveToStorage(): void {
    const currentIdeas = this.ideasSubject.value;
    const data = {
      ideas: currentIdeas,
      exportedAt: new Date().toISOString(),
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  addIdea(
    title: string,
    description: string,
    categoryId: string | null = null
  ): Idea {
    const currentIdeas = this.ideasSubject.value;
    const newIdea: Idea = {
      id: this.generateId(),
      title,
      description,
      categoryId,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 0, // Top priority
    };

    // Increment priority of existing ideas
    const updatedIdeas = currentIdeas.map((idea) => ({
      ...idea,
      priority: idea.priority + 1,
    }));

    const allIdeas = [newIdea, ...updatedIdeas];
    this.ideasSubject.next(allIdeas);
    this.saveToStorage();
    return newIdea;
  }

  updateIdea(id: string, updates: Partial<Idea>): void {
    const currentIdeas = this.ideasSubject.value;
    const updatedIdeas = currentIdeas.map((idea) =>
      idea.id === id ? { ...idea, ...updates, updatedAt: new Date() } : idea
    );
    this.ideasSubject.next(updatedIdeas);
    this.saveToStorage();
  }

  deleteIdea(id: string): void {
    const currentIdeas = this.ideasSubject.value;
    const filteredIdeas = currentIdeas.filter((idea) => idea.id !== id);
    this.ideasSubject.next(filteredIdeas);
    this.saveToStorage();
  }

  reorderIdeas(ideas: Idea[]): void {
    const reorderedIdeas = ideas.map((idea, index) => ({
      ...idea,
      priority: index,
    }));
    this.ideasSubject.next(reorderedIdeas);
    this.saveToStorage();
  }

  exportData(): string {
    const data = {
      ideas: this.ideasSubject.value,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.ideas && Array.isArray(data.ideas)) {
        const ideas = data.ideas.map((idea: any) => ({
          ...idea,
          createdAt: new Date(idea.createdAt),
          updatedAt: new Date(idea.updatedAt),
        }));
        this.ideasSubject.next(ideas);
        this.saveToStorage();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
