-- Enter migration here
drop table if exists app_public.messages;

drop table if exists app_public.users_chatrooms;

drop table if exists app_public.chatrooms;

drop table if exists app_public.users;

create table app_public.users (
  id uuid primary key default public.gen_random_uuid () not null,
  username citext not null
);

grant select on app_public.users to :DATABASE_VISITOR;

insert into app_public.users (username)
  values ('helveticascenario'), ('ceci21');

create table app_public.chatrooms (
  id uuid primary key default public.gen_random_uuid () not null
);

grant select on app_public.chatrooms to :DATABASE_VISITOR;

create table app_public.users_chatrooms (
  user_id uuid references app_public.users not null,
  chatroom_id uuid references app_public.chatrooms not null,
  primary key (user_id, chatroom_id)
);

grant select on app_public.users_chatrooms to :DATABASE_VISITOR;

create table app_public.messages (
  id uuid primary key default public.gen_random_uuid () not null,
  created_at timestamptz default now() not null,
  content text not null,
  chatroom_id uuid references app_public.chatrooms not null,
  user_id uuid references app_public.users not null
);

grant select, delete on app_public.messages to :DATABASE_VISITOR;

