export interface User {
  id: string;
  email: string;
  username: string;
  bio?: string;
  profile_picture?: string;
  created_at: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  type: 'free' | 'swap' | 'rent';
  location: string;
  department?: string;
  images: string[];
  user_id: string;
  user?: User;
  created_at: string;
  is_exchanged: boolean;
}

export interface BorrowRecord {
  id: string;
  item_id: string;
  item_title: string;
  borrower_id: string;
  lender_id: string;
  borrowed_at: string;
  returned_at?: string;
  due_date?: string;
  status: 'active' | 'returned' | 'overdue';
  notes?: string;
}
export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  item_id?: string;
  created_at: string;
  sender?: User;
  receiver?: User;
  read?: boolean;
  message_type?: 'text' | 'system';
}

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  item_id?: string;
  last_message?: string;
  last_message_at?: string;
  created_at: string;
  other_user?: User;
  item?: Item;
}

export type Category = 'Textbooks' | 'Electronics' | 'Clothing' | 'Furniture' | 'Stationery' | 'Sports' | 'Kitchen' | 'Other';
export type Condition = 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';