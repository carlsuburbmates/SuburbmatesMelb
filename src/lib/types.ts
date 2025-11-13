export interface Vendor {
  id: string;
  name: string;
  is_vendor: boolean;
  vendor_status: "active" | "inactive" | "suspended";
  vendor_tier: "none" | "basic" | "pro";
  stripe_account_id?: string;
}
