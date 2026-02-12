// localStorage-based data store for Credi-Can MVP

export interface User {
  id: string;
  username: string;
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

export function registerUser(data: { username: string; full_name: string; email: string; password: string; phone_number: string }): User {
  const users = getUsers();
  if (users.find((u) => u.email === data.email)) throw new Error("Email already registered");
  if (users.find((u) => u.username.toLowerCase() === data.username.toLowerCase())) throw new Error("Username already taken");
  const user: User = {
    id: uuid(),
    username: data.username,
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

// Search users by username or email
export function searchUsers(query: string): User[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return getUsers().filter(
    (u) => u.role === "USER" && (u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  );
}

// Kiosk: submit waste and instantly award credits
export function submitAndApproveWaste(userId: string, materialId: string, quantityUnits: number, weightKg: number | null): WasteSubmission {
  const mat = MATERIALS.find((m) => m.id === materialId);
  if (!mat) throw new Error("Material not found");
  if (quantityUnits <= 0) throw new Error("Quantity must be positive");

  // Calculate credits
  let credits = quantityUnits * mat.base_credit_per_unit;
  if (weightKg && weightKg > 0) {
    const kgCredits = weightKg * mat.base_credit_per_kg;
    credits = Math.max(credits, kgCredits);
  }
  credits = Math.round(credits);

  // Apply focus week multiplier
  const focusWeek = getFocusWeek();
  if (focusWeek && focusWeek.material_id === materialId) {
    credits = Math.round(credits * focusWeek.multiplier);
  }

  const submission: WasteSubmission = {
    id: uuid(),
    user_id: userId,
    material_id: materialId,
    quantity_units: quantityUnits,
    weight_kg: weightKg,
    credits_awarded: credits,
    status: "APPROVED",
    created_at: new Date().toISOString(),
  };

  // Save submission
  const subs = getSubmissions();
  subs.push(submission);
  setStore("credi_submissions", subs);

  // Award credits to user
  const users = getUsers();
  const userIdx = users.findIndex((u) => u.id === userId);
  if (userIdx !== -1) {
    users[userIdx].total_credits += credits;
    setStore("credi_users", users);
  }

  // Record transaction
  const txns = getTransactions();
  txns.push({
    id: uuid(),
    user_id: userId,
    amount: credits,
    type: "EARNED",
    description: `${quantityUnits} ${mat.name}${focusWeek && focusWeek.material_id === materialId ? " (Focus ×" + focusWeek.multiplier + ")" : ""}`,
    created_at: new Date().toISOString(),
  });
  setStore("credi_transactions", txns);

  return submission;
}

export function loginUser(identifier: string, password: string): User {
  const users = getUsers();
  const hash = simpleHash(password);
  const user = users.find((u) => (u.email === identifier || u.username === identifier) && u.password_hash === hash);
  if (!user) throw new Error("Invalid username/email or password");
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

// ── Admin: Submission management ──

export function getAllSubmissions(): WasteSubmission[] {
  return getSubmissions().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function approveSubmission(submissionId: string) {
  const subs = getSubmissions();
  const idx = subs.findIndex((s) => s.id === submissionId);
  if (idx === -1) throw new Error("Submission not found");
  if (subs[idx].status !== "PENDING") throw new Error("Only pending submissions can be approved");

  subs[idx].status = "APPROVED";

  // Apply focus week multiplier
  const focusWeek = getFocusWeek();
  let credits = subs[idx].credits_awarded;
  if (focusWeek && focusWeek.material_id === subs[idx].material_id) {
    credits = credits * focusWeek.multiplier;
    subs[idx].credits_awarded = credits;
  }

  setStore("credi_submissions", subs);

  // Award credits to user
  const users = getUsers();
  const userIdx = users.findIndex((u) => u.id === subs[idx].user_id);
  if (userIdx !== -1) {
    users[userIdx].total_credits += credits;
    setStore("credi_users", users);
  }

  // Record transaction
  const txns = getTransactions();
  const mat = MATERIALS.find((m) => m.id === subs[idx].material_id);
  txns.push({
    id: uuid(),
    user_id: subs[idx].user_id,
    amount: credits,
    type: "EARNED",
    description: `Approved: ${subs[idx].quantity_units} ${mat?.name ?? "items"}${focusWeek && focusWeek.material_id === subs[idx].material_id ? " (Focus Week ×" + focusWeek.multiplier + ")" : ""}`,
    created_at: new Date().toISOString(),
  });
  setStore("credi_transactions", txns);
}

export function rejectSubmission(submissionId: string) {
  const subs = getSubmissions();
  const idx = subs.findIndex((s) => s.id === submissionId);
  if (idx === -1) throw new Error("Submission not found");
  if (subs[idx].status !== "PENDING") throw new Error("Only pending submissions can be rejected");
  subs[idx].status = "REJECTED";
  setStore("credi_submissions", subs);
}

// ── Admin: Focus Week ──

export interface FocusWeek {
  material_id: string;
  multiplier: number;
  label: string;
  started_at: string;
}

export function getFocusWeek(): FocusWeek | null {
  return getStore<FocusWeek | null>("credi_focus_week", null);
}

export function setFocusWeek(materialId: string, multiplier: number): FocusWeek {
  const mat = MATERIALS.find((m) => m.id === materialId);
  if (!mat) throw new Error("Material not found");
  const fw: FocusWeek = {
    material_id: materialId,
    multiplier,
    label: mat.name,
    started_at: new Date().toISOString(),
  };
  setStore("credi_focus_week", fw);
  return fw;
}

export function clearFocusWeek() {
  localStorage.removeItem("credi_focus_week");
}

// ── Admin: Stats ──

export function getAdminStats() {
  const subs = getSubmissions();
  const users = getUsers();
  return {
    totalUsers: users.filter((u) => u.role === "USER").length,
    pendingCount: subs.filter((s) => s.status === "PENDING").length,
    approvedCount: subs.filter((s) => s.status === "APPROVED").length,
    rejectedCount: subs.filter((s) => s.status === "REJECTED").length,
    totalCreditsAwarded: subs.filter((s) => s.status === "APPROVED").reduce((a, s) => a + s.credits_awarded, 0),
  };
}

// ── Seed demo data ──

export function ensureAdminExists() {
  const users = getUsers();
  if (!users.some((u) => u.email === "admin@credican.cm")) {
    const admin: User = {
      id: uuid(),
      username: "admin",
      full_name: "Kiosk Manager",
      email: "admin@credican.cm",
      password_hash: simpleHash("admin123"),
      phone_number: "+237600000000",
      role: "ADMIN",
      total_credits: 0,
      created_at: new Date().toISOString(),
    };
    users.push(admin);
    setStore("credi_users", users);
  }
}

// Ensure admin exists on module load
ensureAdminExists();

export function seedDemoData(userId: string) {
  const subs = getSubmissions();
  // Only seed once per user
  if (subs.some((s) => s.user_id === userId)) return;

  const now = Date.now();
  const day = 86400000;
  const demoSubmissions: WasteSubmission[] = [
    { id: uuid(), user_id: userId, material_id: "mat-plastic", quantity_units: 12, weight_kg: 0.6, credits_awarded: 24, status: "APPROVED", created_at: new Date(now - 6 * day).toISOString() },
    { id: uuid(), user_id: userId, material_id: "mat-metal", quantity_units: 5, weight_kg: 2.5, credits_awarded: 25, status: "APPROVED", created_at: new Date(now - 5 * day).toISOString() },
    { id: uuid(), user_id: userId, material_id: "mat-cans", quantity_units: 20, weight_kg: 1.0, credits_awarded: 60, status: "APPROVED", created_at: new Date(now - 4 * day).toISOString() },
    { id: uuid(), user_id: userId, material_id: "mat-glass", quantity_units: 8, weight_kg: 3.2, credits_awarded: 32, status: "APPROVED", created_at: new Date(now - 3 * day).toISOString() },
    { id: uuid(), user_id: userId, material_id: "mat-plastic", quantity_units: 6, weight_kg: 0.3, credits_awarded: 12, status: "PENDING", created_at: new Date(now - 1 * day).toISOString() },
    { id: uuid(), user_id: userId, material_id: "mat-cans", quantity_units: 10, weight_kg: null, credits_awarded: 30, status: "REJECTED", created_at: new Date(now - 2 * day).toISOString() },
  ];

  const approvedCredits = demoSubmissions.filter((s) => s.status === "APPROVED").reduce((a, s) => a + s.credits_awarded, 0);

  // Save submissions
  setStore("credi_submissions", [...subs, ...demoSubmissions]);

  // Save transactions
  const txns = getTransactions();
  demoSubmissions.filter((s) => s.status === "APPROVED").forEach((s) => {
    const mat = MATERIALS.find((m) => m.id === s.material_id);
    txns.push({ id: uuid(), user_id: userId, amount: s.credits_awarded, type: "EARNED", description: `Recycled ${s.quantity_units} ${mat?.name ?? "items"}`, created_at: s.created_at });
  });
  // Bonus
  txns.push({ id: uuid(), user_id: userId, amount: 50, type: "BONUS", description: "Weekly leaderboard bonus (#2)", created_at: new Date(now - 2 * day).toISOString() });
  setStore("credi_transactions", txns);

  // Update user credits
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx !== -1) {
    users[idx].total_credits = approvedCredits + 50;
    setStore("credi_users", users);
    setCurrentUser(users[idx]);
  }
}

// ── Stats helpers ──

export function getUserMaterialStats(userId: string) {
  const subs = getUserSubmissions(userId).filter((s) => s.status === "APPROVED");
  return MATERIALS.map((m) => ({
    material: m,
    totalUnits: subs.filter((s) => s.material_id === m.id).reduce((a, s) => a + s.quantity_units, 0),
  }));
}
