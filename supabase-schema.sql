-- Run this in Supabase SQL Editor.
-- Then create one admin user in Authentication > Users.

create table if not exists public.products (
  id text primary key,
  title text not null,
  category text not null default 'mobile-accessories',
  price numeric(10, 2) not null default 0,
  old_price numeric(10, 2),
  description text not null default '',
  image_url text not null default '',
  badge text,
  options text[] not null default '{}',
  is_custom boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
using (is_active = true);

drop policy if exists "Authenticated admins can read all products" on public.products;
create policy "Authenticated admins can read all products"
on public.products
for select
to authenticated
using (true);

drop policy if exists "Authenticated admins can insert products" on public.products;
create policy "Authenticated admins can insert products"
on public.products
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated admins can update products" on public.products;
create policy "Authenticated admins can update products"
on public.products
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated admins can delete products" on public.products;
create policy "Authenticated admins can delete products"
on public.products
for delete
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects
for select
using (bucket_id = 'product-images');

drop policy if exists "Authenticated admins can upload product images" on storage.objects;
create policy "Authenticated admins can upload product images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'product-images');

drop policy if exists "Authenticated admins can update product images" on storage.objects;
create policy "Authenticated admins can update product images"
on storage.objects
for update
to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

drop policy if exists "Authenticated admins can delete product images" on storage.objects;
create policy "Authenticated admins can delete product images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'product-images');
