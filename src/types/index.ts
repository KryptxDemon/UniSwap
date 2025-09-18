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
  userId: number;
  email: string;
  username: string;
  studentId: string;
  bio?: string;
  profilePicture?: string;
}

export interface Item {
  id: string;
  itemId?: number;
  title?: string;
  itemName?: string;
  description: string;
  category: Category & { categoryName?: string };
  condition?: string;
  itemCondition?: string;
  type?: "free" | "swap" | "rent";
  itemType?: string;
  location: Location & { locationName?: string };
  department?: string;
  images: string[];
  user_id?: string;
  user?: User;
  post?: {
    user?: User;
    postTime?: string;
  };
  created_at?: string;
  is_exchanged?: boolean;
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
  tuitionId: number;
  salary: number;
  daysWeek: number;
  clazz: string;
  subject: string;
  tStatus: "available" | "taken" | "completed";
  canSwap?: boolean;
  swapDetails?: string;
  contactPhone: string;
  tutorPreference?: string;
  addressUrl?: string;
  location?: string; // Simple location string
  createdAt?: string;
  user?: User; // Direct user relationship, not nested in post
}

export interface Post {
  postId: number;
  imageUrls: string;
  postTime: string;
  user?: User;
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
