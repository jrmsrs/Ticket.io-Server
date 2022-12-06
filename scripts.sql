/* Gerar tabelas (importante) */
drop table if exists `user`;
create table `user` (
  `id` varchar(36) not null primary key,
  `name` varchar(40) not null,
  `email` varchar(255) null unique,
  `cpf` varchar(11) not null unique,
  `cep` varchar(8) null,
  `created_at` timestamp not null default CURRENT_TIMESTAMP
);

drop table if exists `group`;
create table `group` (
  `id` varchar(36) not null primary key,
  `name` varchar(255) not null unique,
  `created_at` timestamp not null default CURRENT_TIMESTAMP
);

drop table if exists `group_users`;
create table `group_users` (
  `group_id` varchar(36) references `group`,
  `user_id` varchar(36) references `user`,
  PRIMARY KEY (`user_id`, `group_id`)
);

/* Inserções de exemplo */
insert into `group` (`name`) values ('74ebc1b8-7115-11ed-ac78-448a5b2c2d83', 'Grupo Exemplo');
insert into `user` (`cep`, `cpf`, `email`, `name`) values ('86857c48-7005-11ed-ac78-448a5b2c2d83', '21666000', '66600066600', 'exemplo@email.com','Exemplo de Exemplo');
insert into `group_users` values ('74ebc1b8-7115-11ed-ac78-448a5b2c2d83','86857c48-7005-11ed-ac78-448a5b2c2d83');

/* Query pra todos os users */
select * from `user`;

/* Query pra todos os grupos */
select * from `user`;

/* Query pra todos os users e os grupos que participam (e vice-versa) */
select `group`.`name` as `nome do grupo`, `user`.`email` as `membro` 
from `user` 
inner join `group_users` 
on `user`.`id` = `group_users`.`user_id` 
inner join `group`
on `group_users`.`group_id` = `group`.`id`;

/* Query dos users de um grupo (id) especifico */
select `user`.`id` as `usuario id`, `user`.`email`, `user`.`cep`, `user`.`created_at`
from `user` 
inner join `group_users`
on `user`.`id` = `group_users`.`user_id` 
where `group_id` = '74ebc1b8-7115-11ed-ac78-448a5b2c2d83';