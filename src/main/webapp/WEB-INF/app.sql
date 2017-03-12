delete from t_dynamic_conf where id > 0;
insert into t_dynamic_conf values(1,'1','organization.1','省公司','所属机构');
insert into t_dynamic_conf values(2,'1','organization.2','部门(地市)','所属机构');
insert into t_dynamic_conf values(3,'1','organization.3','班组','所属机构');
insert into t_dynamic_conf values(4,'1','contract-type.1','业务代办','用工性质');

delete from t_dept where id >= 0;
insert into t_dept values(0,-1,'省公司');
insert into t_dept values(1,0,'市场销售部');
insert into t_dept values(2,0,'支撑服务部');
insert into t_dept values(3,0,'财务部');
insert into t_dept values(4,0,'综合部');
insert into t_dept values(5,0,'南京');
insert into t_dept values(6,0,'苏州');
insert into t_dept values(7,0,'无锡');
insert into t_dept values(8,0,'常州');
insert into t_dept values(9,0,'镇江');
insert into t_dept values(10,0,'扬州');
insert into t_dept values(11,0,'泰州');
insert into t_dept values(12,0,'南通');
insert into t_dept values(13,0,'淮安');
insert into t_dept values(14,0,'盐城');
insert into t_dept values(15,0,'徐州');
insert into t_dept values(16,0,'宿迁');
insert into t_dept values(17,0,'连云港');

delete from t_role where id > 0;
insert into t_role values(1, '人力资源主管');
insert into t_role values(2, '人力资源经理');
insert into t_role values(3, '文书');
insert into t_role values(4, '地市（部门）经理');
insert into t_role values(5, '班组长');

insert into t_dept_role VALUES (0,1),(0,2);
insert into t_dept_role VALUES (1,3),(1,4),(1,5);
insert into t_dept_role VALUES (2,3),(2,4),(2,5);
insert into t_dept_role VALUES (3,3),(3,4),(3,5);
insert into t_dept_role VALUES (4,3),(4,4),(4,5);
insert into t_dept_role VALUES (5,3),(5,4),(5,5);
insert into t_dept_role VALUES (6,3),(6,4),(6,5);
insert into t_dept_role VALUES (7,3),(7,4),(7,5);
insert into t_dept_role VALUES (8,3),(8,4),(8,5);
insert into t_dept_role VALUES (9,3),(9,4),(9,5);
insert into t_dept_role VALUES (10,3),(10,4),(10,5);
insert into t_dept_role VALUES (11,3),(11,4),(11,5);
insert into t_dept_role VALUES (12,3),(12,4),(12,5);
insert into t_dept_role VALUES (13,3),(13,4),(13,5);
insert into t_dept_role VALUES (14,3),(14,4),(14,5);
insert into t_dept_role VALUES (15,3),(15,4),(15,5);
insert into t_dept_role VALUES (16,3),(16,4),(16,5);
insert into t_dept_role VALUES (17,3),(17,4),(17,5);

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
)ENGINE = INNODB;

insert into t_grade_user(id, full_name,organization,code) VALUES (-10,'administrator',0,'a');

delete from t_mod where id > 11;
delete from t_role_mod where mod_id > 11;

insert into t_mod values(12,'系统维护',null,null,'fa fa-user-secret',0);
insert into t_mod values(13,'人员管理',null,'grade-user','fa fa-user',12);
insert into t_role_mod VALUES (-2,12);
insert into t_role_mod VALUES (-2,13);

insert into t_mod values(14,'模板管理',null,null,'',0);
insert into t_mod values(15,'上传模板',null,'main-template-record','fa fa-cloud-upload',14);
insert into t_mod values(16,'下载模板',null,'download-template','fa fa-cloud-download',14);
insert into t_role_mod VALUES (-2,14),(-2,15),(-2,16);

drop table IF EXISTS t_main_template;
create table t_main_template(
  id int not null primary key,
  belong date,
  dept_id int,
  download_times int,
  file_name varchar(128),
  record_id int,
  upload_time timestamp DEFAULT now()
)ENGINE = INNODB;

drop table IF EXISTS t_main_template_record;
create table t_main_template_record(
  id int not null primary key,
  belong date,
  finished int,
  status int,
  creator varchar(64),
  create_time timestamp DEFAULT now()
)ENGINE = INNODB;



