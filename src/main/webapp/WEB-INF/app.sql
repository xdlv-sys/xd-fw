
insert into t_mod values(12,'教学辅助',null,null,'fa',0);
insert into t_mod values(13,'课堂提问',null,'draw','fa fa-hand-o-right',12);

insert into t_role values(1, '授课老师');
insert into t_role_mod VALUES (1, 12);
insert into t_role_mod VALUES (1, 13);
insert into t_role_mod VALUES (-2,12);
insert into t_role_mod VALUES (-2,13);

drop table IF EXISTS t_draw;
create table t_draw(
  id int PRIMARY KEY ,
  name varchar(16),
  duration int,
  reset TINYINT,
  conf varchar(128),
  user_id int,
  froala TINYINT,
  create_time TIMESTAMP
);

drop table IF EXISTS t_draw_item;
create table t_draw_item(
  id int PRIMARY KEY ,
  draw_id int,
  name varchar(16),
  content varchar(512),
  heart int,
  star int
);