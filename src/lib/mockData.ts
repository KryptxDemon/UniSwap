import { Category, Location } from '../types';

export const mockCategories: Category[] = [
  { id: "textbooks", name: "Textbooks" },
  { id: "electronics", name: "Electronics" },
  { id: "clothing", name: "Clothing" },
  { id: "furniture", name: "Furniture" },
  { id: "stationery", name: "Stationery" },
  { id: "sports", name: "Sports" },
  { id: "kitchen", name: "Kitchen" },
  { id: "other", name: "Other" },
];

export const mockLocations: Location[] = [
  // On Campus
  { id: "tarek-huda-hall", name: "Tarek Huda Hall", type: "on-campus" },
  { id: "shah-hall", name: "Shah Hall", type: "on-campus" },
  { id: "abu-sayeed-hall", name: "Abu Sayeed Hall", type: "on-campus" },
  { id: "kazi-nazrul-islam-hall", name: "Kazi Nazrul Islam Hall", type: "on-campus" },
  { id: "library", name: "Library", type: "on-campus" },
  { id: "tsc", name: "TSC", type: "on-campus" },
  { id: "ce-building", name: "CE Building", type: "on-campus" },
  { id: "me-building", name: "ME Building", type: "on-campus" },
  { id: "eee-building", name: "EEE Building", type: "on-campus" },
  { id: "muktijoddha-hall", name: "Muktijoddha Hall", type: "on-campus" },
  { id: "sufia-kamal-hall", name: "Sufia Kamal Hall", type: "on-campus" },
  { id: "taposhi-rabeya-hall", name: "Taposhi Rabeya Hall", type: "on-campus" },
  { id: "shamsun-nahar-hall", name: "Shamsun Nahar Hall", type: "on-campus" },
  { id: "cse-building", name: "CSE Building", type: "on-campus" },
  { id: "architecture-building", name: "Architecture Building", type: "on-campus" },
  { id: "pme-building", name: "PME Building", type: "on-campus" },
  { id: "incubator", name: "Incubator", type: "on-campus" },
  { id: "dr-qudrat-e-khuda-hall", name: "Dr. Qudrat-E-Khuda Hall", type: "on-campus" },
  { id: "teachers-dorm", name: "Teachers Dorm", type: "on-campus" },
  { id: "west-gate", name: "West Gate", type: "on-campus" },
  
  // Off Campus
  { id: "agrabad", name: "Agrabad", type: "off-campus" },
  { id: "pahartali", name: "Pahartali", type: "off-campus" },
  { id: "chawkbazar", name: "Chawkbazar", type: "off-campus" },
  { id: "nasirabad", name: "Nasirabad", type: "off-campus" },
  { id: "khulshi", name: "Khulshi", type: "off-campus" },
  { id: "gec", name: "GEC", type: "off-campus" },
  { id: "oxygen", name: "Oxygen", type: "off-campus" },
  { id: "muradpur", name: "Muradpur", type: "off-campus" },
  { id: "kotwali", name: "Kotwali", type: "off-campus" },
  { id: "anderkilla", name: "Anderkilla", type: "off-campus" },
  { id: "jubilee-road", name: "Jubilee Road", type: "off-campus" },
  { id: "bayezid", name: "Bayezid", type: "off-campus" },
  { id: "halishahar", name: "Halishahar", type: "off-campus" },
  { id: "epz", name: "EPZ", type: "off-campus" },
  { id: "patenga", name: "Patenga", type: "off-campus" },
];

export const mockSubjects = [
  "Mathematics",
  "Physics", 
  "Chemistry",
  "Biology",
  "English",
  "Bangla",
  "Higher Mathematics",
  "ICT",
  "Economics",
  "Accounting",
  "Business Studies",
];

export const mockClassLevels = [
  "Class 6",
  "Class 7",
  "Class 8", 
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
  "University Level",
];