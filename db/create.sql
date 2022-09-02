CREATE TABLE store(
  id serial primary key not null,
  name varchar not null,
  link varchar,
  deleted bool not null default false
);

CREATE TABLE coupon(
  id serial primary key not null,
  code varchar not null,
  valid_until date,
  description varchar,
  store_id integer references store(id) not null,
  deleted bool not null default false
);