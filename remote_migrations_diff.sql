
  create table "public"."disputes" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "refund_request_id" uuid,
    "order_id" uuid,
    "vendor_id" uuid,
    "customer_id" uuid,
    "admin_id" uuid,
    "status" character varying(20) default 'open'::character varying,
    "resolution_type" character varying(30) default 'under_review'::character varying,
    "resolution_notes" text,
    "evidence_customer" jsonb,
    "evidence_vendor" jsonb,
    "decision_by_admin" uuid,
    "decision_notes" text,
    "decision_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."disputes" enable row level security;


  create table "public"."marketplace_sales" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "vendor_id" uuid not null,
    "product_id" uuid not null,
    "customer_id" uuid,
    "stripe_session_id" text not null,
    "stripe_payment_intent_id" text,
    "amount_cents" integer not null,
    "platform_fee_cents" integer not null,
    "currency" text not null default 'aud'::text,
    "status" text not null default 'pending'::text,
    "metadata" jsonb
      );


alter table "public"."marketplace_sales" enable row level security;


  create table "public"."orders" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "customer_id" uuid,
    "vendor_id" uuid,
    "product_id" uuid,
    "amount_cents" integer not null,
    "commission_cents" integer default 0,
    "vendor_net_cents" integer not null,
    "stripe_payment_intent_id" character varying(255),
    "stripe_charge_id" character varying(255),
    "status" character varying(20) default 'pending'::character varying,
    "download_url" character varying(500),
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."orders" enable row level security;


  create table "public"."refund_requests" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "order_id" uuid,
    "vendor_id" uuid,
    "customer_id" uuid,
    "reason" text not null,
    "description" text,
    "amount_cents" integer not null,
    "status" character varying(20) default 'pending'::character varying,
    "approved_at" timestamp with time zone,
    "rejected_at" timestamp with time zone,
    "rejected_reason" text,
    "stripe_refund_id" character varying(255),
    "processed_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."refund_requests" enable row level security;

alter table "public"."featured_slots" add column "stripe_payment_intent_id" character varying(255);

CREATE UNIQUE INDEX disputes_pkey ON public.disputes USING btree (id);

CREATE INDEX idx_disputes_parties ON public.disputes USING btree (customer_id, vendor_id, admin_id);

CREATE INDEX idx_disputes_status ON public.disputes USING btree (status);

CREATE INDEX idx_disputes_vendor ON public.disputes USING btree (vendor_id);

CREATE INDEX idx_featured_slots_stripe_pi ON public.featured_slots USING btree (stripe_payment_intent_id);

CREATE INDEX idx_orders_customer ON public.orders USING btree (customer_id);

CREATE INDEX idx_orders_customer_id ON public.orders USING btree (customer_id);

CREATE INDEX idx_orders_customer_vendor ON public.orders USING btree (customer_id, vendor_id);

CREATE INDEX idx_orders_status ON public.orders USING btree (status);

CREATE INDEX idx_orders_vendor ON public.orders USING btree (vendor_id);

CREATE INDEX idx_orders_vendor_id ON public.orders USING btree (vendor_id);

CREATE INDEX idx_refund_requests_customer_vendor ON public.refund_requests USING btree (customer_id, vendor_id);

CREATE INDEX idx_refund_requests_order ON public.refund_requests USING btree (order_id);

CREATE INDEX idx_refund_requests_status ON public.refund_requests USING btree (status);

CREATE UNIQUE INDEX marketplace_sales_pkey ON public.marketplace_sales USING btree (id);

CREATE UNIQUE INDEX orders_pkey ON public.orders USING btree (id);

CREATE UNIQUE INDEX refund_requests_pkey ON public.refund_requests USING btree (id);

alter table "public"."disputes" add constraint "disputes_pkey" PRIMARY KEY using index "disputes_pkey";

alter table "public"."marketplace_sales" add constraint "marketplace_sales_pkey" PRIMARY KEY using index "marketplace_sales_pkey";

alter table "public"."orders" add constraint "orders_pkey" PRIMARY KEY using index "orders_pkey";

alter table "public"."refund_requests" add constraint "refund_requests_pkey" PRIMARY KEY using index "refund_requests_pkey";

alter table "public"."appeals" add constraint "appeals_related_dispute_id_fkey" FOREIGN KEY (related_dispute_id) REFERENCES public.disputes(id) ON DELETE SET NULL not valid;

alter table "public"."appeals" validate constraint "appeals_related_dispute_id_fkey";

alter table "public"."disputes" add constraint "disputes_admin_id_fkey" FOREIGN KEY (admin_id) REFERENCES public.users(id) not valid;

alter table "public"."disputes" validate constraint "disputes_admin_id_fkey";

alter table "public"."disputes" add constraint "disputes_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.users(id) not valid;

alter table "public"."disputes" validate constraint "disputes_customer_id_fkey";

alter table "public"."disputes" add constraint "disputes_decision_by_admin_fkey" FOREIGN KEY (decision_by_admin) REFERENCES public.users(id) not valid;

alter table "public"."disputes" validate constraint "disputes_decision_by_admin_fkey";

alter table "public"."disputes" add constraint "disputes_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) not valid;

alter table "public"."disputes" validate constraint "disputes_order_id_fkey";

alter table "public"."disputes" add constraint "disputes_refund_request_id_fkey" FOREIGN KEY (refund_request_id) REFERENCES public.refund_requests(id) ON DELETE CASCADE not valid;

alter table "public"."disputes" validate constraint "disputes_refund_request_id_fkey";

alter table "public"."disputes" add constraint "disputes_resolution_type_check" CHECK (((resolution_type)::text = ANY ((ARRAY['buyer_refund'::character varying, 'vendor_keeps'::character varying, 'split'::character varying])::text[]))) not valid;

alter table "public"."disputes" validate constraint "disputes_resolution_type_check";

alter table "public"."disputes" add constraint "disputes_status_check" CHECK (((status)::text = ANY ((ARRAY['open'::character varying, 'under_review'::character varying, 'resolved'::character varying, 'cancelled'::character varying])::text[]))) not valid;

alter table "public"."disputes" validate constraint "disputes_status_check";

alter table "public"."disputes" add constraint "disputes_vendor_id_fkey" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) not valid;

alter table "public"."disputes" validate constraint "disputes_vendor_id_fkey";

alter table "public"."marketplace_sales" add constraint "marketplace_sales_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES auth.users(id) not valid;

alter table "public"."marketplace_sales" validate constraint "marketplace_sales_customer_id_fkey";

alter table "public"."marketplace_sales" add constraint "marketplace_sales_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) not valid;

alter table "public"."marketplace_sales" validate constraint "marketplace_sales_product_id_fkey";

alter table "public"."marketplace_sales" add constraint "marketplace_sales_vendor_id_fkey" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) not valid;

alter table "public"."marketplace_sales" validate constraint "marketplace_sales_vendor_id_fkey";

alter table "public"."orders" add constraint "orders_amount_cents_check" CHECK ((amount_cents > 0)) not valid;

alter table "public"."orders" validate constraint "orders_amount_cents_check";

alter table "public"."orders" add constraint "orders_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.users(id) not valid;

alter table "public"."orders" validate constraint "orders_customer_id_fkey";

alter table "public"."orders" add constraint "orders_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) not valid;

alter table "public"."orders" validate constraint "orders_product_id_fkey";

alter table "public"."orders" add constraint "orders_status_check" CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'succeeded'::character varying, 'failed'::character varying, 'reversed'::character varying])::text[]))) not valid;

alter table "public"."orders" validate constraint "orders_status_check";

alter table "public"."orders" add constraint "orders_vendor_id_fkey" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) not valid;

alter table "public"."orders" validate constraint "orders_vendor_id_fkey";

alter table "public"."refund_requests" add constraint "refund_requests_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.users(id) not valid;

alter table "public"."refund_requests" validate constraint "refund_requests_customer_id_fkey";

alter table "public"."refund_requests" add constraint "refund_requests_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE not valid;

alter table "public"."refund_requests" validate constraint "refund_requests_order_id_fkey";

alter table "public"."refund_requests" add constraint "refund_requests_status_check" CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'cancelled'::character varying])::text[]))) not valid;

alter table "public"."refund_requests" validate constraint "refund_requests_status_check";

alter table "public"."refund_requests" add constraint "refund_requests_vendor_id_fkey" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) not valid;

alter table "public"."refund_requests" validate constraint "refund_requests_vendor_id_fkey";

grant delete on table "public"."disputes" to "anon";

grant insert on table "public"."disputes" to "anon";

grant references on table "public"."disputes" to "anon";

grant select on table "public"."disputes" to "anon";

grant trigger on table "public"."disputes" to "anon";

grant truncate on table "public"."disputes" to "anon";

grant update on table "public"."disputes" to "anon";

grant delete on table "public"."disputes" to "authenticated";

grant insert on table "public"."disputes" to "authenticated";

grant references on table "public"."disputes" to "authenticated";

grant select on table "public"."disputes" to "authenticated";

grant trigger on table "public"."disputes" to "authenticated";

grant truncate on table "public"."disputes" to "authenticated";

grant update on table "public"."disputes" to "authenticated";

grant delete on table "public"."disputes" to "service_role";

grant insert on table "public"."disputes" to "service_role";

grant references on table "public"."disputes" to "service_role";

grant select on table "public"."disputes" to "service_role";

grant trigger on table "public"."disputes" to "service_role";

grant truncate on table "public"."disputes" to "service_role";

grant update on table "public"."disputes" to "service_role";

grant delete on table "public"."marketplace_sales" to "anon";

grant insert on table "public"."marketplace_sales" to "anon";

grant references on table "public"."marketplace_sales" to "anon";

grant select on table "public"."marketplace_sales" to "anon";

grant trigger on table "public"."marketplace_sales" to "anon";

grant truncate on table "public"."marketplace_sales" to "anon";

grant update on table "public"."marketplace_sales" to "anon";

grant delete on table "public"."marketplace_sales" to "authenticated";

grant insert on table "public"."marketplace_sales" to "authenticated";

grant references on table "public"."marketplace_sales" to "authenticated";

grant select on table "public"."marketplace_sales" to "authenticated";

grant trigger on table "public"."marketplace_sales" to "authenticated";

grant truncate on table "public"."marketplace_sales" to "authenticated";

grant update on table "public"."marketplace_sales" to "authenticated";

grant delete on table "public"."marketplace_sales" to "service_role";

grant insert on table "public"."marketplace_sales" to "service_role";

grant references on table "public"."marketplace_sales" to "service_role";

grant select on table "public"."marketplace_sales" to "service_role";

grant trigger on table "public"."marketplace_sales" to "service_role";

grant truncate on table "public"."marketplace_sales" to "service_role";

grant update on table "public"."marketplace_sales" to "service_role";

grant delete on table "public"."orders" to "anon";

grant insert on table "public"."orders" to "anon";

grant references on table "public"."orders" to "anon";

grant select on table "public"."orders" to "anon";

grant trigger on table "public"."orders" to "anon";

grant truncate on table "public"."orders" to "anon";

grant update on table "public"."orders" to "anon";

grant delete on table "public"."orders" to "authenticated";

grant insert on table "public"."orders" to "authenticated";

grant references on table "public"."orders" to "authenticated";

grant select on table "public"."orders" to "authenticated";

grant trigger on table "public"."orders" to "authenticated";

grant truncate on table "public"."orders" to "authenticated";

grant update on table "public"."orders" to "authenticated";

grant delete on table "public"."orders" to "service_role";

grant insert on table "public"."orders" to "service_role";

grant references on table "public"."orders" to "service_role";

grant select on table "public"."orders" to "service_role";

grant trigger on table "public"."orders" to "service_role";

grant truncate on table "public"."orders" to "service_role";

grant update on table "public"."orders" to "service_role";

grant delete on table "public"."refund_requests" to "anon";

grant insert on table "public"."refund_requests" to "anon";

grant references on table "public"."refund_requests" to "anon";

grant select on table "public"."refund_requests" to "anon";

grant trigger on table "public"."refund_requests" to "anon";

grant truncate on table "public"."refund_requests" to "anon";

grant update on table "public"."refund_requests" to "anon";

grant delete on table "public"."refund_requests" to "authenticated";

grant insert on table "public"."refund_requests" to "authenticated";

grant references on table "public"."refund_requests" to "authenticated";

grant select on table "public"."refund_requests" to "authenticated";

grant trigger on table "public"."refund_requests" to "authenticated";

grant truncate on table "public"."refund_requests" to "authenticated";

grant update on table "public"."refund_requests" to "authenticated";

grant delete on table "public"."refund_requests" to "service_role";

grant insert on table "public"."refund_requests" to "service_role";

grant references on table "public"."refund_requests" to "service_role";

grant select on table "public"."refund_requests" to "service_role";

grant trigger on table "public"."refund_requests" to "service_role";

grant truncate on table "public"."refund_requests" to "service_role";

grant update on table "public"."refund_requests" to "service_role";


  create policy "Admin can manage all disputes"
  on "public"."disputes"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND ((users.user_type)::text = 'admin'::text)))));



  create policy "Dispute parties can access"
  on "public"."disputes"
  as permissive
  for all
  to public
using (((((auth.uid() = customer_id) OR (auth.uid() = vendor_id)) OR (auth.uid() = admin_id)) OR (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND ((users.user_type)::text = 'admin'::text))))));



  create policy "Admins can view all marketplace sales"
  on "public"."marketplace_sales"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND ((users.user_type)::text = 'admin'::text)))));



  create policy "Vendors can view their own sales"
  on "public"."marketplace_sales"
  as permissive
  for select
  to public
using ((vendor_id IN ( SELECT vendors.id
   FROM public.vendors
  WHERE (vendors.user_id = auth.uid()))));



  create policy "Admin can manage all orders"
  on "public"."orders"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND ((users.user_type)::text = 'admin'::text)))));



  create policy "Customers own orders"
  on "public"."orders"
  as permissive
  for all
  to public
using ((customer_id = auth.uid()));



  create policy "Vendors own sales"
  on "public"."orders"
  as permissive
  for select
  to public
using ((vendor_id IN ( SELECT vendors.id
   FROM public.vendors
  WHERE (vendors.user_id = auth.uid()))));



  create policy "Admin can manage all refund requests"
  on "public"."refund_requests"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND ((users.user_type)::text = 'admin'::text)))));



  create policy "Customers own refund requests"
  on "public"."refund_requests"
  as permissive
  for all
  to public
using ((customer_id = auth.uid()));



  create policy "Vendors can manage refund requests for their orders"
  on "public"."refund_requests"
  as permissive
  for all
  to public
using ((vendor_id IN ( SELECT vendors.id
   FROM public.vendors
  WHERE (vendors.user_id = auth.uid()))));


CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON public.disputes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_refund_requests_updated_at BEFORE UPDATE ON public.refund_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();



