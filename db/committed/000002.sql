--! Previous: sha1:c1ad95277c3cdad325810c88b28f9e7eebae26bb
--! Hash: sha1:e5608cf93625a6b129d2855dfe979b9c84f2a239

-- Enter migration here

DROP TABLE IF EXISTS app_public.drawings;
CREATE TABLE app_public.drawings (
    mosaic_id UUID primary key default gen_random_uuid(),
    width int not null check (width > 0),
    height int not null check (height > 0),
    name text not null
);

grant
  select
on app_public.drawings to :DATABASE_VISITOR;
