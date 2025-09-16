import { Category, Location } from "../types";

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
  { id: "1", name: "Tarek Huda Hall", type: "on-campus" },
  { id: "2", name: "Shah Hall", type: "on-campus" },
  { id: "3", name: "Abu Sayeed Hall", type: "on-campus" },
  { id: "4", name: "Kazi Nazrul Islam Hall", type: "on-campus" },
  { id: "5", name: "Library", type: "on-campus" },
  { id: "6", name: "TSC", type: "on-campus" },
  { id: "7", name: "CE Building", type: "on-campus" },
  { id: "8", name: "ME Building", type: "on-campus" },
  { id: "9", name: "EEE Building", type: "on-campus" },
  { id: "10", name: "Muktijoddha Hall", type: "on-campus" },
  { id: "11", name: "Sufia Kamal Hall", type: "on-campus" },
  { id: "12", name: "Taposhi Rabeya Hall", type: "on-campus" },
  { id: "13", name: "Shamsun Nahar Hall", type: "on-campus" },
  { id: "14", name: "CSE Building", type: "on-campus" },
  { id: "15", name: "Architecture Building", type: "on-campus" },
  { id: "16", name: "PME Building", type: "on-campus" },
  { id: "17", name: "Incubator", type: "on-campus" },
  { id: "18", name: "Dr. Qudrat-E-Khuda Hall", type: "on-campus" },
  { id: "19", name: "Teachers Dorm", type: "on-campus" },
  { id: "20", name: "West Gate", type: "on-campus" },

  // Off Campus
  { id: "21", name: "Agrabad", type: "off-campus" },
  { id: "22", name: "Pahartali", type: "off-campus" },
  { id: "23", name: "Chawkbazar", type: "off-campus" },
  { id: "24", name: "Nasirabad", type: "off-campus" },
  { id: "25", name: "Khulshi", type: "off-campus" },
  { id: "26", name: "GEC", type: "off-campus" },
  { id: "27", name: "Oxygen", type: "off-campus" },
  { id: "28", name: "Muradpur", type: "off-campus" },
  { id: "29", name: "Kotwali", type: "off-campus" },
  { id: "30", name: "Anderkilla", type: "off-campus" },
  { id: "31", name: "Jubilee Road", type: "off-campus" },
  { id: "32", name: "Bayezid", type: "off-campus" },
  { id: "33", name: "Halishahar", type: "off-campus" },
  { id: "34", name: "EPZ", type: "off-campus" },
  { id: "35", name: "Patenga", type: "off-campus" },
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
