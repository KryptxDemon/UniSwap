export interface Category {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
  type: "on-campus" | "off-campus";
}

export interface User {
  id: string;
  email: string;
  username: string;
  phone: string[];
  student_id: string;
  bio?: string;
  profile_picture?: string;
  created_at: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: Category;
  condition: string;
  type: "free" | "swap" | "rent";
  location: Location;
  department?: string;
  images: string[];
  user_id: string;
  user?: User;
  created_at: string;
  is_exchanged: boolean;
}

export interface SwapRequest {
  id: string;
  item_id: string;
  requester_id: string;
  owner_id: string;
  offered_item_id?: string;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface BorrowRecord {
  id: string;
  item_id: string;
  item_title: string;
  borrower_id: string;
  lender_id: string;
  borrowed_at: string;
  expected_return_date?: string;
  actual_return_date?: string;
  status: "active" | "returned" | "overdue" | "cancelled";
  notes?: string;
  timeline: BorrowTimeline[];
}

export interface BorrowTimeline {
  id: string;
  borrow_record_id: string;
  event_type:
    | "requested"
    | "approved"
    | "borrowed"
    | "returned"
    | "overdue"
    | "cancelled";
  event_date: string;
  notes?: string;
}

export interface Tuition {
  id: string;
  title: string;
  description: string;
  salary: number;
  days_per_week: number;
  class_level: string;
  subjects: string[];
  location: Location;
  status: "available" | "taken" | "completed";
  tutor_id: string;
  tutor?: User;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  content: string;
  images: string[];
  user_id: string;
  user?: User;
  post_time: string;
  likes_count: number;
  comments_count: number;
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  conversation_id: string;
  item_id?: string;
  created_at: string;
  sender?: User;
  receiver?: User;
  read: boolean;
  message_type: "text" | "image" | "system";
  reply_to?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  item_id?: string;
  last_message?: string;
  last_message_at?: string;
  created_at: string;
  updated_at: string;
  other_user?: User;
  item?: Item;
  unread_count: number;
}

export type Condition = "New" | "Like New" | "Good" | "Fair" | "Poor";
