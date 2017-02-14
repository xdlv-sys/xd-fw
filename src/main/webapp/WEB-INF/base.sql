-- CREATE DATABASE xapp DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
drop table IF EXISTS t_primary_key;
create table t_primary_key(
  table_name VARCHAR(32) not null primary key,
  current_id int not null
);
drop table IF EXISTS t_user;
create table t_user(
  id int not null primary key,
  name VARCHAR(50) UNIQUE,
  password VARCHAR(32),
  birthday date,
  sex TINYINT,
  entry_time date,
  mobile varchar(11),
  phone varchar(16),
  id_card varchar(32),
  mail varchar(20),
  dept int
);

drop table IF EXISTS t_role;
create table t_role(
  id int not null primary key,
  name VARCHAR(50) UNIQUE
);

drop table IF EXISTS t_mod;
create table t_mod(
  id int not null primary key,
  name VARCHAR(50),
  url VARCHAR(50),
  router_id VARCHAR(50),
  addition VARCHAR(50),
  parent_id int
);
drop table IF EXISTS t_user_role;
create table t_user_role(
  user_id int not null,
  role_id int not null
);

drop table IF EXISTS t_role_mod;
create table t_role_mod(
  role_id int not null,
  mod_id int not null
);
drop table IF EXISTS t_dept;
create table t_dept(
  id int not null primary key,
  parent int,
  name varchar(32)
);
drop table IF EXISTS t_dept_role;
create table t_dept_role(
  dept_id int not null,
  role_id int not null
);

insert into t_dept values(0,-1,'公司');
insert into t_user(id,name,password,sex,mail,dept) values(-10,'a','0cc175b9c0f1b6a831c399e269772661',0,'a@a.com',0);
insert into t_role values(-2, '管理员');
insert into t_user_role values(-10,-2);
insert into t_dept_role VALUES (0,-2);

insert into t_mod values(1,'系统配置',null,null,'fa fa-user-secret',0);
insert into t_mod values(2,'用户管理',null,'user','fa fa-user',1);
insert into t_mod values(3,'动态参数',null,'conf','fa fa-pencil',1);
insert into t_mod values(4,'新增用户','/user/saveUser',null,null,2);
insert into t_mod values(5,'查看用户','/user/obtainUsers',null,null,2);
insert into t_mod values(6,'删除用户','/user/deleteUser',null,null,2);
insert into t_mod values(7,'修改用户','/user/saveUser',null,null,2);

insert into t_mod values(8,'新增角色','/role/saveRole',null,null,2);
insert into t_mod values(9,'查看角色','/role/obtainRoles',null,null,2);
insert into t_mod values(10,'删除角色','/role/deleteRole',null,null,2);
insert into t_mod values(11,'修改角色','/role/saveRole',null,null,2);

insert into t_role_mod values(-2,1);
insert into t_role_mod values(-2,2);
insert into t_role_mod values(-2,3);
insert into t_role_mod values(-2,4);
insert into t_role_mod values(-2,5);
insert into t_role_mod values(-2,6);
insert into t_role_mod values(-2,7);
insert into t_role_mod values(-2,8);
insert into t_role_mod values(-2,9);
insert into t_role_mod values(-2,10);
insert into t_role_mod values(-2,11);
insert into t_role_mod values(-2,12);











