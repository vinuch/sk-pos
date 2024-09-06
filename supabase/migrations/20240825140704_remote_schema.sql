create type "public"."Food_type" as enum ('soup', 'swallow', 'protein(meat/fish)');

create table "public"."MenuItems" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "name" character varying,
    "price" bigint,
    "type" "Food_type"
);


alter table "public"."MenuItems" enable row level security;

create table "public"."OrderItems" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "order_id" bigint,
    "menu_item_id" bigint
);


alter table "public"."OrderItems" enable row level security;

create table "public"."Orders" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "total_amount" bigint,
    "payment_status" boolean,
    "payment_method" character varying
);


alter table "public"."Orders" enable row level security;

CREATE UNIQUE INDEX "MenuItems_pkey" ON public."MenuItems" USING btree (id);

CREATE UNIQUE INDEX "OrderItems_pkey" ON public."OrderItems" USING btree (id);

CREATE UNIQUE INDEX "Orders_pkey" ON public."Orders" USING btree (id);

alter table "public"."MenuItems" add constraint "MenuItems_pkey" PRIMARY KEY using index "MenuItems_pkey";

alter table "public"."OrderItems" add constraint "OrderItems_pkey" PRIMARY KEY using index "OrderItems_pkey";

alter table "public"."Orders" add constraint "Orders_pkey" PRIMARY KEY using index "Orders_pkey";

alter table "public"."OrderItems" add constraint "OrderItems_menu_item_id_fkey" FOREIGN KEY (menu_item_id) REFERENCES "MenuItems"(id) not valid;

alter table "public"."OrderItems" validate constraint "OrderItems_menu_item_id_fkey";

alter table "public"."OrderItems" add constraint "OrderItems_order_id_fkey" FOREIGN KEY (order_id) REFERENCES "Orders"(id) not valid;

alter table "public"."OrderItems" validate constraint "OrderItems_order_id_fkey";

grant delete on table "public"."MenuItems" to "anon";

grant insert on table "public"."MenuItems" to "anon";

grant references on table "public"."MenuItems" to "anon";

grant select on table "public"."MenuItems" to "anon";

grant trigger on table "public"."MenuItems" to "anon";

grant truncate on table "public"."MenuItems" to "anon";

grant update on table "public"."MenuItems" to "anon";

grant delete on table "public"."MenuItems" to "authenticated";

grant insert on table "public"."MenuItems" to "authenticated";

grant references on table "public"."MenuItems" to "authenticated";

grant select on table "public"."MenuItems" to "authenticated";

grant trigger on table "public"."MenuItems" to "authenticated";

grant truncate on table "public"."MenuItems" to "authenticated";

grant update on table "public"."MenuItems" to "authenticated";

grant delete on table "public"."MenuItems" to "service_role";

grant insert on table "public"."MenuItems" to "service_role";

grant references on table "public"."MenuItems" to "service_role";

grant select on table "public"."MenuItems" to "service_role";

grant trigger on table "public"."MenuItems" to "service_role";

grant truncate on table "public"."MenuItems" to "service_role";

grant update on table "public"."MenuItems" to "service_role";

grant delete on table "public"."OrderItems" to "anon";

grant insert on table "public"."OrderItems" to "anon";

grant references on table "public"."OrderItems" to "anon";

grant select on table "public"."OrderItems" to "anon";

grant trigger on table "public"."OrderItems" to "anon";

grant truncate on table "public"."OrderItems" to "anon";

grant update on table "public"."OrderItems" to "anon";

grant delete on table "public"."OrderItems" to "authenticated";

grant insert on table "public"."OrderItems" to "authenticated";

grant references on table "public"."OrderItems" to "authenticated";

grant select on table "public"."OrderItems" to "authenticated";

grant trigger on table "public"."OrderItems" to "authenticated";

grant truncate on table "public"."OrderItems" to "authenticated";

grant update on table "public"."OrderItems" to "authenticated";

grant delete on table "public"."OrderItems" to "service_role";

grant insert on table "public"."OrderItems" to "service_role";

grant references on table "public"."OrderItems" to "service_role";

grant select on table "public"."OrderItems" to "service_role";

grant trigger on table "public"."OrderItems" to "service_role";

grant truncate on table "public"."OrderItems" to "service_role";

grant update on table "public"."OrderItems" to "service_role";

grant delete on table "public"."Orders" to "anon";

grant insert on table "public"."Orders" to "anon";

grant references on table "public"."Orders" to "anon";

grant select on table "public"."Orders" to "anon";

grant trigger on table "public"."Orders" to "anon";

grant truncate on table "public"."Orders" to "anon";

grant update on table "public"."Orders" to "anon";

grant delete on table "public"."Orders" to "authenticated";

grant insert on table "public"."Orders" to "authenticated";

grant references on table "public"."Orders" to "authenticated";

grant select on table "public"."Orders" to "authenticated";

grant trigger on table "public"."Orders" to "authenticated";

grant truncate on table "public"."Orders" to "authenticated";

grant update on table "public"."Orders" to "authenticated";

grant delete on table "public"."Orders" to "service_role";

grant insert on table "public"."Orders" to "service_role";

grant references on table "public"."Orders" to "service_role";

grant select on table "public"."Orders" to "service_role";

grant trigger on table "public"."Orders" to "service_role";

grant truncate on table "public"."Orders" to "service_role";

grant update on table "public"."Orders" to "service_role";

create policy "Enable read access for all users"
on "public"."MenuItems"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."OrderItems"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."Orders"
as permissive
for select
to public
using (true);


