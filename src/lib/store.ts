// localStorage-based data store for Credi-Can MVP

export interface User {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  phone_number: string;
  role: "USER" | "ADMIN";
  total_credits: number;
  created_at: string;
}

export interface Material {
  id: string;
  name: string;
  bin_color: string;
  base_credit_per_unit: number;
  base_credit_per_kg: number;
}

export interface WasteSubmission {
  id: string;
  user_id: string;
  material_id: string;
  quantity_units: number;
  weight_kg: number | null;
  credits_awarded: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  created_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: "EARNED" | "BONUS" | "REDEEMED";
  description: string;
  created_at: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  credit_cost: number;
  partner_name: string;
  is_active: boolean;
  category: string;
}

export interface Redemption {
  id: string;
  user_id: string;
  reward_id: string;
  credits_used: number;
  created_at: string;
}

// ── Seed data ──

export const MATERIALS: Material[] = [
  { id: "mat-plastic", name: "Plastic Bottles", bin_color: "Yellow", base_credit_per_unit: 2, base_credit_per_kg: 20 },
  { id: "mat-metal", name: "Metal", bin_color: "Red", base_credit_per_unit: 5, base_credit_per_kg: 40 },
  { id: "mat-cans", name: "Cans", bin_color: "Orange", base_credit_per_unit: 3, base_credit_per_kg: 30 },
  { id: "mat-glass", name: "Glass", bin_color: "Green", base_credit_per_unit: 4, base_credit_per_kg: 25 },
];

export const REWARDS: Reward[] = [
  { id: "rw-1", name: "Bread Voucher", description: "Fresh bread from local bakery", credit_cost: 50, partner_name: "Local Bakery", is_active: true, category: "Bakery" },
  { id: "rw-2", name: "Family Bread Pack", description: "Large bread pack for the family", credit_cost: 120, partner_name: "Local Bakery", is_active: true, category: "Bakery" },
  { id: "rw-3", name: "Moto Ride Voucher", description: "One moto taxi ride", credit_cost: 80, partner_name: "Transport Partner", is_active: true, category: "Transport" },
  { id: "rw-4", name: "Taxi Discount", description: "Discount on taxi fare", credit_cost: 150, partner_name: "Transport Partner", is_active: true, category: "Transport" },
  { id: "rw-5", name: "500 FCFA Airtime", description: "Mobile credit top-up", credit_cost: 100, partner_name: "Mobile Partner", is_active: true, category: "Mobile" },
  { id: "rw-6", name: "1000 FCFA Airtime", description: "Mobile credit top-up", credit_cost: 200, partner_name: "Mobile Partner", is_active: true, category: "Mobile" },
  { id: "rw-7", name: "Exercise Books Pack", description: "Pack of school exercise books", credit_cost: 200, partner_name: "Education Partner", is_active: true, category: "Education" },
  { id: "rw-8", name: "Rice (1kg)", description: "1kg bag of rice", credit_cost: 300, partner_name: "Grocery Partner", is_active: true, category: "Grocery" },
  { id: "rw-9", name: "Cooking Oil", description: "Small bottle of cooking oil", credit_cost: 250, partner_name: "Grocery Partner", is_active: true, category: "Grocery" },
];

// ── Helpers ──

function getStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStore<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uuid() {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
}

// Simple hash (not secure — MVP only)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return hash.toString(36);
}

// ── Auth ──

export function getUsers(): User[] {
  return getStore<User[]>("credi_users", []);
}

export function registerUser(data: { full_name: string; email: string; password: string; phone_number: string }): User {
  const users = getUsers();
  if (users.find((u) => u.email === data.email)) throw new Error("Email already registered");
  const user: User = {
    id: uuid(),
    full_name: data.full_name,
    email: data.email,
    password_hash: simpleHash(data.password),
    phone_number: data.phone_number,
    role: "USER",
    total_credits: 0,
    created_at: new Date().toISOString(),
  };
  users.push(user);
  setStore("credi_users", users);
  return user;
}

export function loginUser(email: string, password: string): User {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password_hash === simpleHash(password));
  if (!user) throw new Error("Invalid email or password");
  return user;
}

export function setCurrentUser(user: User | null) {
  if (user) setStore("credi_current_user", user);
  else localStorage.removeItem("credi_current_user");
}

export function getCurrentUser(): User | null {
  return getStore<User | null>("credi_current_user", null);
}

export function refreshCurrentUser(): User | null {
  const current = getCurrentUser();
  if (!current) return null;
  const users = getUsers();
  const fresh = users.find((u) => u.id === current.id) ?? null;
  if (fresh) setCurrentUser(fresh);
  return fresh;
}

// ── Submissions ──

export function getSubmissions(): WasteSubmission[] {
  return getStore<WasteSubmission[]>("credi_submissions", []);
}

export function getUserSubmissions(userId: string): WasteSubmission[] {
  return getSubmissions().filter((s) => s.user_id === userId);
}

// ── Transactions ──

export function getTransactions(): CreditTransaction[] {
  return getStore<CreditTransaction[]>("credi_transactions", []);
}

export function getUserTransactions(userId: string): CreditTransaction[] {
  return getTransactions().filter((t) => t.user_id === userId);
}

// ── Redemptions ──

export function getRedemptions(): Redemption[] {
  return getStore<Redemption[]>("credi_redemptions", []);
}

export function redeemReward(userId: string, rewardId: string): Redemption {
  const reward = REWARDS.find((r) => r.id === rewardId);
  if (!reward) throw new Error("Reward not found");

  const users = getUsers();
  const userIdx = users.findIndex((u) => u.id === userId);
  if (userIdx === -1) throw new Error("User not found");
  if (users[userIdx].total_credits < reward.credit_cost) throw new Error("Not enough credits");

  // Deduct credits
  users[userIdx].total_credits -= reward.credit_cost;
  setStore("credi_users", users);
  setCurrentUser(users[userIdx]);

  // Record transaction
  const txns = getTransactions();
  txns.push({
    id: uuid(),
    user_id: userId,
    amount: -reward.credit_cost,
    type: "REDEEMED",
    description: `Redeemed: ${reward.name}`,
    created_at: new Date().toISOString(),
  });
  setStore("credi_transactions", txns);

  // Record redemption
  const redemptions = getRedemptions();
  const redemption: Redemption = {
    id: uuid(),
    user_id: userId,
    reward_id: rewardId,
    credits_used: reward.credit_cost,
    created_at: new Date().toISOString(),
  };
  redemptions.push(redemption);
  setStore("credi_redemptions", redemptions);

  return redemption;
}

// ── Stats helpers ──

export function getUserMaterialStats(userId: string) {
  const subs = getUserSubmissions(userId).filter((s) => s.status === "APPROVED");
  return MATERIALS.map((m) => ({
    material: m,
    totalUnits: subs.filter((s) => s.material_id === m.id).reduce((a, s) => a + s.quantity_units, 0),
  }));
}
