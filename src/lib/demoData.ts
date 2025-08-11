import { User, Item, Message, Conversation, BorrowRecord, SwapRequest, Tuition, Post, BorrowTimeline } from "../types";

// Demo users
export const demoUsers: User[] = [
  {
    id: "1",
    email: "sorowaryuki@student.cuet.ac.bd",
    username: "sorowarislam",
    phone: ["+8801712345678", "+8801812345678"],
    student_id: "1904001",
    bio: "Engineering student passionate about clash of clans, cgpa and cricket.",
    profile_picture: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "fatema_islam_minju@student.cuet.ac.bd",
    username: "fatema_minju",
    phone: ["+8801712345679"],
    student_id: "1904002",
    bio: "Love helping fellow students with study materials and stationery.",
    profile_picture: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "3",
    email: "wahidafridi@stjoseph.bd",
    username: "wahid_afridi60",
    phone: ["+8801712345680"],
    student_id: "1904003",
    bio: "Always looking for tuitions.",
    profile_picture: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "4",
    email: "shrabo@student.cuet.ac.bd",
    username: "shrabonti_sarkar",
    phone: ["+8801712345681"],
    student_id: "1904004",
    bio: "Math and science tutor available for exchange of services.",
    profile_picture: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "5",
    email: "arnob123@student.cuet.ac.bd",
    username: "arnob_mozumder",
    phone: ["+8801712345682"],
    student_id: "1904005",
    bio: "Tech enthusiast with various electronics for rent and exchange.",
    profile_picture: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "6",
    email: "asifanwar@student.cuet.ac.bd",
    username: "asif_anwar",
    phone: ["+8801712345683"],
    student_id: "1904006",
    bio: "Book lover and literature enthusiast. Always happy to share good reads.",
    profile_picture: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
    created_at: "2025-01-01T00:00:00Z",
  },
];

// Demo items
export const demoItems: Item[] = [
  {
    id: "1",
    title: "Practical Physics - Giassudin",
    description:
      "PHY-142 te kaaje dibe. Used for one semester, excellent condition but a bit dirty. This book covers all the practical experiments and theory needed for the physics lab course. Includes detailed explanations of each experiment with proper diagrams and calculations. Perfect for engineering students.",
    category: "Textbooks",
    condition: "Like New",
    type: "swap",
    location: "Pahartali",
    department: "Engineering",
    images: [
      "https://scontent.fdac181-1.fna.fbcdn.net/v/t1.6435-9/205729626_203743011646517_834630484838151940_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_ohc=gCq_2My2XI8Q7kNvwHjQ-bt&_nc_oc=AdmWHIBXoBGR5qGeXiDNHS-TxQk5x7FnrMdwd7KYYOf_SoC-TVynywy94WWneT5WsFA&_nc_zt=23&_nc_ht=scontent.fdac181-1.fna&_nc_gid=5qtSK-16ZLo7VcoeyjXuow&oh=00_AfS98gqqJJppaOn30Ay3d2JKOaA7wiPltQ7zdczbv-u73w&oe=68B000A0",
    ],
    user_id: "1",
    user: demoUsers[0],
    created_at: "2025-01-15T10:30:00Z",
    is_exchanged: false,
  },
  {
    id: "2",
    title: "Used T Scale for donation",
    description:
      "Mecha drawing T-scale ruler in good condition. Free for any engineering student who needs it. This is a professional grade T-scale that I used throughout my mechanical drawing courses. Still has clear markings and the sliding mechanism works perfectly. Would be great for any first or second year engineering student.",
    category: "Stationery",
    condition: "Good",
    type: "free",
    location: "Engineering Building",
    images: [
      "https://img.drz.lazcdn.com/static/bd/p/62656e0d668e19717ebb3351e0c126ff.jpg_2200x2200q80.jpg_.webp",
    ],
    user_id: "2",
    user: demoUsers[1],
    created_at: "2025-01-16T14:20:00Z",
    is_exchanged: false,
  },
  {
    id: "3",
    title: "Foldable table for exchange",
    description:
      "Compact foldable study table, perfect for dorm rooms. Looking to exchange for a table lamp. This table has been my study companion for 2 years. It's lightweight, easy to fold and store, and has a smooth surface perfect for writing and laptop use. The legs are sturdy and adjustable. Would prefer to exchange for a good reading lamp or desk lamp.",
    category: "Furniture",
    condition: "Good",
    type: "swap",
    location: "Kazi Nazrul Islam Hall",
    images: [
      "https://img.drz.lazcdn.com/collect/sg/other/roc/8016040af9c48d8ceb9da5d2075e7bb6.jpg_1200x1200q80.jpg_.webp",
    ],
    user_id: "3",
    user: demoUsers[2],
    created_at: "2025-01-17T09:15:00Z",
    is_exchanged: false,
  },
  {
    id: "4",
    title: "Tuition in Halishahar exchange",
    description:
      "Class - 9, Sub - Math, physics and chemistry. Looking for tuition around bahaddarhat or GEC. I'm offering tutoring services for Class 9 students in Mathematics, Physics, and Chemistry. I have 3 years of experience and have helped many students improve their grades. Looking to exchange this service for tutoring in higher level subjects or other academic help.",
    category: "Other",
    condition: "New",
    type: "swap",
    location: "Anywhere in campus",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5sB3r2LhWuSTNMr13k7WuCSOBfAWb-i8m1Q&s",
    ],
    user_id: "4",
    user: demoUsers[3],
    created_at: "2025-01-18T16:45:00Z",
    is_exchanged: false,
  },
  {
    id: "5",
    title: "DJI Mini 2 SE drone for rent",
    description:
      "DJI Mini 2 SE is available for short-term rental. You can use it for any event at 1000tk/day. This drone is perfect for capturing aerial footage of events, campus activities, or personal projects. It comes with extra batteries, memory card, and carrying case. I'll provide a quick tutorial on how to use it safely. Deposit required.",
    category: "Electronics",
    condition: "Like New",
    type: "rent",
    location: "Abu Sayeed Hall",
    images: [
      "https://www-cdn.djiits.com/dps/0c7373a3a5fb102f9c36461905e4b44b.jpg",
    ],
    user_id: "5",
    user: demoUsers[4],
    created_at: "2025-01-19T11:30:00Z",
    is_exchanged: false,
  },
  {
    id: "6",
    title: "Himur Nil Jochona",
    description:
      "হিমুর নীল জোছনা নন্দিত কথাসাহিত্যিক হুমায়ূন আহমেদের সৃষ্ট চরিত্রগুলোর মধ্যে হিমু অন্যতম একটি উপন্যাস। If anyone is a humayun ahmed fan, let me know. Up for opening a community. This is one of the most beloved novels in Bengali literature. The book is in excellent condition with no torn pages. Perfect for literature enthusiasts or anyone wanting to explore Bengali fiction.",
    category: "Other",
    condition: "Good",
    type: "free",
    location: "CSE Building",
    department: "CSE",
    images: [
      "https://sg-test-11.slatic.net/other/roc/8efcfbd7e5763d2899819a690ba30123.jpg",
    ],
    user_id: "6",
    user: demoUsers[5],
    created_at: "2025-01-20T08:20:00Z",
    is_exchanged: false,
  },
];

// Demo messages
export const demoMessages: Message[] = [
  {
    id: "1",
    content: "Hi! Is the physics book still available?",
    sender_id: "2",
    receiver_id: "1",
    conversation_id: "1",
    item_id: "1",
    created_at: "2025-01-21T10:00:00Z",
    sender: demoUsers[1],
    receiver: demoUsers[0],
    read: true,
    message_type: "text",
  },
  {
    id: "2",
    content: "Yes, it is! What would you like to exchange for it?",
    sender_id: "1",
    receiver_id: "2",
    conversation_id: "1",
    item_id: "1",
    created_at: "2025-01-21T10:15:00Z",
    sender: demoUsers[0],
    receiver: demoUsers[1],
    read: true,
    message_type: "text",
  },
  {
    id: "3",
    content: "I have a chemistry textbook that might interest you. Would you like to see it?",
    sender_id: "2",
    receiver_id: "1",
    conversation_id: "1",
    item_id: "1",
    created_at: "2025-01-21T10:30:00Z",
    sender: demoUsers[1],
    receiver: demoUsers[0],
    read: false,
    message_type: "text",
  },
  {
    id: "4",
    content: "That sounds perfect! Can we meet at the library tomorrow?",
    sender_id: "1",
    receiver_id: "2",
    conversation_id: "1",
    item_id: "1",
    created_at: "2025-01-21T10:45:00Z",
    sender: demoUsers[0],
    receiver: demoUsers[1],
    read: false,
    message_type: "text",
  },
  {
    id: "5",
    content: "Hey! Is the drone still available for rent?",
    sender_id: "3",
    receiver_id: "5",
    conversation_id: "2",
    item_id: "5",
    created_at: "2025-01-21T14:00:00Z",
    sender: demoUsers[2],
    receiver: demoUsers[4],
    read: true,
    message_type: "text",
  },
  {
    id: "6",
    content: "Yes! It's available. When do you need it?",
    sender_id: "5",
    receiver_id: "3",
    conversation_id: "2",
    item_id: "5",
    created_at: "2025-01-21T14:15:00Z",
    sender: demoUsers[4],
    receiver: demoUsers[2],
    read: false,
    message_type: "text",
  },
];

// Demo conversations
export const demoConversations: Conversation[] = [
  {
    id: "1",
    participants: ["1", "2"],
    item_id: "1",
    last_message: "That sounds perfect! Can we meet at the library tomorrow?",
    last_message_at: "2025-01-21T10:45:00Z",
    created_at: "2025-01-21T10:00:00Z",
    updated_at: "2025-01-21T10:45:00Z",
    other_user: demoUsers[1],
    item: demoItems[0],
    unread_count: 1,
  },
  {
    id: "2",
    participants: ["3", "5"],
    item_id: "5",
    last_message: "Yes! It's available. When do you need it?",
    last_message_at: "2025-01-21T14:15:00Z",
    created_at: "2025-01-21T14:00:00Z",
    updated_at: "2025-01-21T14:15:00Z",
    other_user: demoUsers[4],
    item: demoItems[4],
    unread_count: 1,
  },
];

// Demo borrow records
export const demoBorrowRecords: BorrowRecord[] = [
  {
    id: "1",
    item_id: "5",
    item_title: "DJI Mini 2 SE drone for rent",
    borrower_id: "1",
    lender_id: "5",
    borrowed_at: "2025-01-15T10:00:00Z",
    expected_return_date: "2025-01-18T10:00:00Z",
    actual_return_date: "2025-01-17T15:30:00Z",
    status: "returned",
    notes: "Used for campus event photography. Returned in excellent condition.",
    timeline: [
      {
        id: "t1",
        borrow_record_id: "1",
        event_type: "requested",
        event_date: "2025-01-14T09:00:00Z",
        notes: "Initial request made"
      },
      {
        id: "t2",
        borrow_record_id: "1",
        event_type: "approved",
        event_date: "2025-01-14T14:00:00Z",
        notes: "Request approved by lender"
      },
      {
        id: "t3",
        borrow_record_id: "1",
        event_type: "borrowed",
        event_date: "2025-01-15T10:00:00Z",
        notes: "Item picked up"
      },
      {
        id: "t4",
        borrow_record_id: "1",
        event_type: "returned",
        event_date: "2025-01-17T15:30:00Z",
        notes: "Item returned in excellent condition"
      }
    ]
  },
  {
    id: "2",
    item_id: "3",
    item_title: "Foldable table for exchange",
    borrower_id: "2",
    lender_id: "3",
    borrowed_at: "2025-01-20T09:00:00Z",
    expected_return_date: "2025-01-25T09:00:00Z",
    status: "active",
    notes: "Borrowed for study purposes during exam week.",
    timeline: [
      {
        id: "t5",
        borrow_record_id: "2",
        event_type: "requested",
        event_date: "2025-01-19T16:00:00Z",
        notes: "Request for exam week"
      },
      {
        id: "t6",
        borrow_record_id: "2",
        event_type: "approved",
        event_date: "2025-01-19T18:00:00Z",
        notes: "Approved for study purposes"
      },
      {
        id: "t7",
        borrow_record_id: "2",
        event_type: "borrowed",
        event_date: "2025-01-20T09:00:00Z",
        notes: "Table picked up"
      }
    ]
  },
  {
    id: "3",
    item_id: "1",
    item_title: "Practical Physics - Giassudin",
    borrower_id: "4",
    lender_id: "1",
    borrowed_at: "2025-01-10T14:00:00Z",
    expected_return_date: "2025-01-17T14:00:00Z",
    actual_return_date: "2025-01-20T16:00:00Z",
    status: "returned",
    notes: "Needed for lab experiments. Returned with some additional notes.",
    timeline: [
      {
        id: "t8",
        borrow_record_id: "3",
        event_type: "requested",
        event_date: "2025-01-09T10:00:00Z",
        notes: "Needed for lab work"
      },
      {
        id: "t9",
        borrow_record_id: "3",
        event_type: "approved",
        event_date: "2025-01-09T12:00:00Z",
        notes: "Approved for lab experiments"
      },
      {
        id: "t10",
        borrow_record_id: "3",
        event_type: "borrowed",
        event_date: "2025-01-10T14:00:00Z",
        notes: "Book borrowed"
      },
      {
        id: "t11",
        borrow_record_id: "3",
        event_type: "overdue",
        event_date: "2025-01-17T14:00:00Z",
        notes: "Item became overdue"
      },
      {
        id: "t12",
        borrow_record_id: "3",
        event_type: "returned",
        event_date: "2025-01-20T16:00:00Z",
        notes: "Returned with additional notes"
      }
    ]
  },
];
// Current logged in user (demo)
export const currentUser: User = demoUsers[0];

// Demo swap requests
export const demoSwapRequests: SwapRequest[] = [
  {
    id: "1",
    item_id: "1",
    requester_id: "2",
    owner_id: "1",
    offered_item_id: "2",
    message: "I'd like to exchange my T-scale for your physics book",
    status: "pending",
    created_at: "2025-01-21T10:00:00Z",
    updated_at: "2025-01-21T10:00:00Z",
  },
  {
    id: "2",
    item_id: "3",
    requester_id: "4",
    owner_id: "3",
    message: "Can I borrow this table for my exam preparation?",
    status: "accepted",
    created_at: "2025-01-19T16:00:00Z",
    updated_at: "2025-01-19T18:00:00Z",
  },
];

// Demo tuitions
export const demoTuitions: Tuition[] = [
  {
    id: "1",
    title: "Mathematics Tuition for Class 9-10",
    description: "Experienced tutor offering comprehensive math lessons for SSC students. Covers algebra, geometry, and trigonometry.",
    salary: 3000,
    days_per_week: 3,
    class_level: "Class 9-10",
    subjects: ["Mathematics", "Higher Mathematics"],
    location: "Halishahar",
    status: "available",
    tutor_id: "4",
    tutor: demoUsers[3],
    created_at: "2025-01-18T16:45:00Z",
    updated_at: "2025-01-18T16:45:00Z",
  },
  {
    id: "2",
    title: "Physics and Chemistry Tuition",
    description: "Engineering student offering science tuition for HSC students. Strong background in physics and chemistry.",
    salary: 4000,
    days_per_week: 4,
    class_level: "Class 11-12",
    subjects: ["Physics", "Chemistry"],
    location: "GEC Area",
    status: "taken",
    tutor_id: "1",
    tutor: demoUsers[0],
    created_at: "2025-01-15T12:00:00Z",
    updated_at: "2025-01-20T10:00:00Z",
  },
];

// Demo posts
export const demoPosts: Post[] = [
  {
    id: "1",
    content: "Just finished my final exams! Looking forward to sharing some textbooks that I no longer need. Check out my listings! 📚",
    images: [
      "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    user_id: "1",
    user: demoUsers[0],
    post_time: "2025-01-21T14:30:00Z",
    likes_count: 12,
    comments_count: 3,
  },
  {
    id: "2",
    content: "Great experience using UniSwap! Successfully exchanged my old laptop for a newer model. Thanks to the amazing community! 💻✨",
    images: [],
    user_id: "5",
    user: demoUsers[4],
    post_time: "2025-01-20T09:15:00Z",
    likes_count: 8,
    comments_count: 1,
  },
];