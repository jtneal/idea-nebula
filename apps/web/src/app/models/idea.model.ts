export interface Idea {
  id: string;
  title: string;
  description: string;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
  priority: number;
}