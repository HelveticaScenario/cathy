-- Enter migration here
drop function if exists app_public.current_user_id;

drop function if exists app_public.authenticate;

drop type if exists app_public.jwt_token;

drop trigger if exists _900_notify_messages_on_insert on app_public.messages;

drop function if exists app_public.notify_message;

drop function if exists app_public.make_new_message;

drop function if exists app_public.create_message_and_notify;

drop table if exists app_public.messages;

drop table if exists app_public.users_chatrooms;

drop table if exists app_public.chatrooms;

drop table if exists app_public.users;

-- create table app_public.users (
--   id uuid primary key default public.gen_random_uuid () not null,
--   username citext not null
-- );
-- grant select on app_public.users to :DATABASE_VISITOR;
-- insert into app_public.users (username)
--   values ('helveticascenario'), ('ceci21');
-- create table app_public.chatrooms (
--   id uuid primary key default public.gen_random_uuid () not null
-- );
-- grant select on app_public.chatrooms to :DATABASE_VISITOR;
-- create table app_public.users_chatrooms (
--   user_id uuid references app_public.users not null,
--   chatroom_id uuid references app_public.chatrooms not null,
--   primary key (user_id, chatroom_id)
-- );
-- grant select on app_public.users_chatrooms to :DATABASE_VISITOR;

create table app_public.messages (
  id uuid primary key default public.gen_random_uuid () not null,
  created_at timestamptz default now() not null,
  content text not null
  -- chatroom_id uuid references app_public.chatrooms not null,
  -- user_id uuid references app_public.users not null

);

grant select, delete on app_public.messages to :DATABASE_VISITOR;

insert into app_public.messages (content)
  values ('hello from mars');

create function app_public.notify_message ()
  returns trigger
  as $$
begin
  perform
    pg_notify('postgraphile:new_message', json_build_object('__node__', json_build_array('messages', new.id))::text);
  return new;
end
$$
language plpgsql
volatile;

create trigger _900_notify_messages_on_insert
  after insert on app_public.messages for each row
  execute procedure app_public.notify_message ();

create type app_public.jwt_token as (
  uid text
);

create function app_public.current_user_id ()
  returns text
  as $$
  select
    nullif (current_setting('jwt.claims.uid', true), '')::text;

$$
language sql
stable
security definer;

-- grant execute on app_public.current_user_id to :DATABASE_VISITOR;
-- create function app_public.authenticate(
--   email text,
--   password text
-- ) returns my_public_schema.jwt_token as $$
-- declare
--   account my_private_schema.person_account;
-- begin
--   select a.* into account
--     from my_private_schema.person_account as a
--     where a.email = authenticate.email;
--   if account.password_hash = crypt(password, account.password_hash) then
--     return (
--       'person_role',
--       extract(epoch from now() + interval '7 days'),
--       account.person_id,
--       account.is_admin,
--       account.username
--     )::my_public_schema.jwt_token;
--   else
--     return null;
--   end if;
-- end;
-- $$ language plpgsql strict security definer;
