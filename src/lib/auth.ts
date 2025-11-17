import { AuthSession, User, Vendor } from "./types";
import { Database } from "./database.types";

// Re-export the supabase client from supabase.ts
import { supabase } from "./supabase";

// Auth state management
class AuthManager {
  private currentSession: AuthSession | null = null;

  async signUp(
    email: string,
    password: string,
    userData: {
      first_name?: string;
      last_name?: string;
      user_type?: "customer" | "vendor";
    }
  ): Promise<AuthSession> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.first_name,
          last_name: userData.last_name,
          user_type: userData.user_type || "customer",
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("User registration failed");
    }

    // Create user record in users table
    await this.createUserRecord(data.user, userData);

    const session = await this.createAuthSession(data.user);
    this.currentSession = session;

    return session;
  }

  async signIn(email: string, password: string): Promise<AuthSession> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    const session = await this.createAuthSession(data.user);
    this.currentSession = session;

    return session;
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
    this.currentSession = null;
  }

  async getCurrentSession(): Promise<AuthSession | null> {
    if (this.currentSession) {
      return this.currentSession;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return null;
    }

    const session = await this.createAuthSession(user);
    this.currentSession = session;
    return session;
  }

  async refreshSession(): Promise<AuthSession | null> {
    const {
      data: { session },
      error,
    } = await supabase.auth.refreshSession();

    if (error || !session?.user) {
      this.currentSession = null;
      return null;
    }

    const authSession = await this.createAuthSession(session.user);
    this.currentSession = authSession;
    return authSession;
  }

  private async createUserRecord(
    user: { id: string; email?: string },
    userData: { first_name?: string; last_name?: string; user_type?: string }
  ): Promise<void> {
    const { error } = await supabase.from("users").insert({
      id: user.id,
      email: user.email || "",
      first_name: userData.first_name || null,
      last_name: userData.last_name || null,
      user_type: userData.user_type || "customer",
      deleted_at: null,
      created_as_business_owner_at: null,
    });

    if (error) {
      throw new Error(`Failed to create user record: ${error.message}`);
    }
  }

  private async createAuthSession(user: {
    id: string;
    email?: string;
  }): Promise<AuthSession> {
    // Get user data from database
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (userError) {
      throw new Error(`Failed to fetch user data: ${userError.message}`);
    }

    const session: AuthSession = {
      user: {
        id: userData.id,
        email: userData.email,
        first_name: userData.first_name ?? undefined,
        last_name: userData.last_name ?? undefined,
        user_type:
          (userData.user_type as "customer" | "vendor" | "admin") || "customer",
        created_at: userData.created_at || new Date().toISOString(),
        updated_at: userData.updated_at || new Date().toISOString(),
        deleted_at: userData.deleted_at ?? undefined,
      },
      token:
        (await supabase.auth.getSession()).data.session?.access_token || "",
    };

    // Get vendor data if user is a vendor
    if (userData?.user_type === "vendor") {
      const { data: vendorData, error: vendorError } = await supabase
        .from("vendors")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!vendorError && vendorData) {
        session.vendor = {
          id: vendorData.id,
          user_id: vendorData.user_id || user.id,
          tier:
            (vendorData.tier as "none" | "basic" | "pro" | "suspended") ||
            "none",
          business_name: vendorData.business_name ?? undefined,
          bio: vendorData.bio ?? undefined,
          primary_lga_id: vendorData.primary_lga_id ?? undefined,
          secondary_lgas: vendorData.secondary_lgas ?? undefined,
          logo_url: vendorData.logo_url ?? undefined,
          profile_color_hex: vendorData.profile_color_hex ?? undefined,
          profile_url: vendorData.profile_url ?? undefined,
          abn_verified: vendorData.abn_verified || false,
          abn: vendorData.abn ?? undefined,
          abn_verified_at: vendorData.abn_verified_at ?? undefined,
          product_count: vendorData.product_count || 0,
          storage_used_mb: vendorData.storage_used_mb || 0,
          stripe_account_id: vendorData.stripe_account_id ?? undefined,
          pro_subscription_id: vendorData.pro_subscription_id ?? undefined,
          pro_subscribed_at: vendorData.pro_subscribed_at ?? undefined,
          pro_cancelled_at: vendorData.pro_cancelled_at ?? undefined,
          last_activity_at:
            vendorData.last_activity_at || new Date().toISOString(),
          inactivity_flagged_at: vendorData.inactivity_flagged_at ?? undefined,
          suspension_reason: vendorData.suspension_reason ?? undefined,
          suspended_at: vendorData.suspended_at ?? undefined,
          can_appeal: vendorData.can_appeal || false,
          payment_reversal_count: vendorData.payment_reversal_count || 0,
          payment_reversal_window_start:
            vendorData.payment_reversal_window_start ?? undefined,
          created_at: vendorData.created_at || new Date().toISOString(),
          updated_at: vendorData.updated_at || new Date().toISOString(),
        };
      }
    }

    return session;
  }

  // Vendor-specific methods
  async createVendorProfile(vendorData: {
    business_name: string;
    bio?: string;
    primary_lga_id?: number;
    profile_url?: string;
  }): Promise<Vendor> {
    const session = await this.getCurrentSession();
    if (!session || session.user.user_type !== "vendor") {
      throw new Error("Must be authenticated as vendor");
    }

    const { data, error } = await supabase.from("vendors").insert({
      user_id: session.user.id,
      tier: "none",
      is_vendor: false,
      vendor_status: "inactive",
      can_sell_products: false,
      stripe_onboarding_complete: false,
      business_name: vendorData.business_name,
      bio: vendorData.bio,
      primary_lga_id: vendorData.primary_lga_id,
      abn_verified: false,
      product_count: 0,
      storage_used_mb: 0,
      product_quota: 0,
      storage_quota_gb: 0,
      commission_rate: 0,
    })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create vendor profile: ${error?.message ?? "unknown error"}`);
    }

    // Update user type to vendor
    await supabase.from("users").update({
      user_type: "vendor",
    }).eq("id", session.user.id);

    // Refresh session
    this.currentSession = await this.refreshSession();

    return data as Vendor;
  }

  async updateVendorProfile(vendorData: Partial<Vendor>): Promise<Vendor> {
    const session = await this.getCurrentSession();
    if (!session?.vendor) {
      throw new Error("Must have vendor profile");
    }

    const { data, error } = await supabase
      .from("vendors")
      .update(vendorData)
      .eq("id", session.vendor.id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update vendor profile: ${error?.message ?? "unknown error"}`);
    }

    // Refresh session
    this.currentSession = await this.refreshSession();

    return data as Vendor;
  }

  // Utility methods
  isVendor(): boolean {
    return this.currentSession?.user.user_type === "vendor";
  }

  isAdmin(): boolean {
    return this.currentSession?.user.user_type === "admin";
  }

  getCurrentUser(): User | null {
    return this.currentSession?.user || null;
  }

  getCurrentVendor(): Vendor | null {
    return this.currentSession?.vendor || null;
  }

  isAuthenticated(): boolean {
    return this.currentSession !== null;
  }
}

export const authManager = new AuthManager();

// Supabase auth state listener
supabase.auth.onAuthStateChange(async (event) => {
  if (event === "SIGNED_IN") {
    // User signed in
    await authManager.refreshSession();
  } else if (event === "SIGNED_OUT") {
    // User signed out
    authManager["currentSession"] = null;
  }
});
