drop table IF EXISTS t_grade_user;
create table t_grade_user(
  id int not null primary key,
  organization int,
  code varchar(64),
  location varchar(8),
  category int,
  job_name varchar(16),
  contract_type int,
  in_service int
);