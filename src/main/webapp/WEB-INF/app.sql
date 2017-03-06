delete from t_dynamic_conf where id > 0;
insert into t_dynamic_conf values(1,'1','organization.1','省公司','所属机构');
insert into t_dynamic_conf values(2,'1','organization.2','部门(地市)','通用确认');
insert into t_dynamic_conf values(3,'1','organization.3','班组','通用确认');

drop table IF EXISTS t_grade_user;
create table t_grade_user(
  id int not null primary key,
  full_name varchar(64),
  organization int,
  code varchar(64),
  location varchar(8),
  category int,
  job_name varchar(16),
  contract_type int,
  in_service int
);

