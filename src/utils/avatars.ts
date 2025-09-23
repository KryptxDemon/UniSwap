// Avatar collection - using emoji and icon-based avatars for a fun, diverse selection
export const AVATAR_COLLECTION = [
  // Animal avatars
  { id: "cat", emoji: "🐱", name: "Cat", category: "animals" },
  { id: "dog", emoji: "🐶", name: "Dog", category: "animals" },
  { id: "fox", emoji: "🦊", name: "Fox", category: "animals" },
  { id: "panda", emoji: "🐼", name: "Panda", category: "animals" },
  { id: "koala", emoji: "🐨", name: "Koala", category: "animals" },
  { id: "lion", emoji: "🦁", name: "Lion", category: "animals" },
  { id: "tiger", emoji: "🐯", name: "Tiger", category: "animals" },
  { id: "monkey", emoji: "🐵", name: "Monkey", category: "animals" },
  { id: "penguin", emoji: "🐧", name: "Penguin", category: "animals" },
  { id: "owl", emoji: "🦉", name: "Owl", category: "animals" },

  // People avatars
  { id: "cool", emoji: "😎", name: "Cool", category: "people" },
  { id: "nerd", emoji: "🤓", name: "Nerd", category: "people" },
  { id: "happy", emoji: "😊", name: "Happy", category: "people" },
  { id: "wink", emoji: "😉", name: "Wink", category: "people" },
  { id: "thinking", emoji: "🤔", name: "Thinking", category: "people" },
  { id: "star_eyes", emoji: "🤩", name: "Star Eyes", category: "people" },
  { id: "ninja", emoji: "🥷", name: "Ninja", category: "people" },
  { id: "cowboy", emoji: "🤠", name: "Cowboy", category: "people" },

  // Objects & Fun
  { id: "robot", emoji: "🤖", name: "Robot", category: "fun" },
  { id: "alien", emoji: "👽", name: "Alien", category: "fun" },
  { id: "unicorn", emoji: "🦄", name: "Unicorn", category: "fun" },
  { id: "dragon", emoji: "🐉", name: "Dragon", category: "fun" },
  { id: "wizard", emoji: "🧙‍♂️", name: "Wizard", category: "fun" },
  { id: "ghost", emoji: "👻", name: "Ghost", category: "fun" },
  { id: "rocket", emoji: "🚀", name: "Rocket", category: "fun" },
  { id: "crown", emoji: "👑", name: "Crown", category: "fun" },
  { id: "gem", emoji: "💎", name: "Diamond", category: "fun" },
  { id: "fire", emoji: "🔥", name: "Fire", category: "fun" },
  { id: "lightning", emoji: "⚡", name: "Lightning", category: "fun" },
  { id: "star", emoji: "⭐", name: "Star", category: "fun" },
];

export const AVATAR_CATEGORIES = [
  { id: "all", name: "All", icon: "🎯" },
  { id: "animals", name: "Animals", icon: "🐾" },
  { id: "people", name: "People", icon: "👥" },
  { id: "fun", name: "Fun", icon: "🎨" },
];

export function getAvatarById(id: string) {
  return AVATAR_COLLECTION.find((avatar) => avatar.id === id);
}

export function getAvatarsByCategory(category: string) {
  if (category === "all") return AVATAR_COLLECTION;
  return AVATAR_COLLECTION.filter((avatar) => avatar.category === category);
}

export function getRandomAvatar() {
  const randomIndex = Math.floor(Math.random() * AVATAR_COLLECTION.length);
  return AVATAR_COLLECTION[randomIndex];
}
