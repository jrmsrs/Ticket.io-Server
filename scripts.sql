/* ------------------------------------ */
/* ------------ ESTRUTURAS ------------ */
/* ------------------------------------ */

/* ------------ USUÁRIOS ------------ */
drop table if exists `user`;
create table `user` (
  `id` varchar(36) not null,
  `name` varchar(40) not null,
  `email` varchar(255) null unique,
  `cpf` varchar(11) not null unique,
  `cep` varchar(8) null,
  `created_at` timestamp not null default CURRENT_TIMESTAMP,
  `role` char(1) null comment '(d)esenvolvedor, (q)ualidade, (g)estor',
  primary key (`id`)
);
/* Inserção exemplo */
insert into `user` values(UUID(), 'Nome Sobrenome', 'nome@email.com', '12345678900', '12345678', null, 'g');

/* ------------ GRUPOS SOLUCIONADORES ------------ */
drop table if exists `group`;
create table `group` (
  `id` varchar(36) not null,
  `name` varchar(255) not null unique,
  `created_at` timestamp not null default CURRENT_TIMESTAMP,
  primary key (`id`)
);
/* Inserção exemplo */
insert into `group` values(UUID(), 'Nome do Grupo Solucionador', null);

/* ------------ GRUPOS/MEMBROS ------------ */
drop table if exists `group_users`;
create table `group_users` (
  `group_id` varchar(36),
  `user_id` varchar(36),
  primary key (`user_id`, `group_id`),
  constraint `group_users_fk1` foreign key (`user_id`) references `user`(`id`) on delete cascade,
  constraint `group_users_fk2` foreign key (`group_id`) references `group`(`id`) on delete cascade
);
/* Inserção exemplo */
insert into `group_users` values('7534c437-efe0-4983-aabf-ca76c54b573f', '0366fc2d-e6ad-4ee4-aaff-1f95fb0ffbd2');

/* ------------ SOLUÇÕES ------------ */
drop table if exists `solution`;
create table `solution` (
  `id` varchar(36) not null,
  `title` varchar(100) not null,
  `details` text not null,
  `created_at` timestamp not null default current_timestamp,
  primary key (`id`)
);
/* Inserção exemplo */
insert into `solution` values (UUID(), 'Titulo', 'Detalhes', null);

/* ------------ PROBLEMAS ------------ */
drop table if exists `tp`;
create table `tp` (
  `id` varchar(36) not null,
  `group_id` varchar(36) default null,
  `title` varchar(255) not null,
  `desc` text not null,
  `dev_contact` text not null,
  `prev_conclusion` timestamp not null,
  `conclusion` timestamp null,
  `root_cause` varchar(36) default null,
  `created_at` timestamp not null default current_timestamp,
  primary key (`id`),
  key `group_id` (`group_id`),
  key `root_cause` (`root_cause`),
  constraint `tp_fk1` foreign key (`group_id`) references `group` (`id`) on delete set null,
  constraint `tp_fk2` foreign key (`root_cause`) references `solution` (`id`) on delete set null
);
/* Insert exemplo */
insert into `tp` values(UUID(), '7534c437-efe0-4983-aabf-ca76c54b573f', 'Título', 'Descrição', 'Contato', '2023-01-15 00:00:00', NULL, NULL, NULL);


/* ------------------------------------ */
/* ------------ QUERIES DO BANCO ------------ */
/* ------------------------------------ */

/* Queries básicas (tabelas) */
select * from `user`;
select * from `group`;
select * from `tp`;
select * from `solution`;

/* Query pra todos os users e os grupos que participam (e vice-versa) */
select `group`.`name` as `nome do grupo`, `user`.`email` as `membro` 
from `user` 
inner join `group_users` 
on `user`.`id` = `group_users`.`user_id` 
inner join `group`
on `group_users`.`group_id` = `group`.`id`;

/* Query dos users de um grupo (pelo id) especifico */
select `user`.`id` as `usuario id`, `user`.`email`, `user`.`cep`, `user`.`created_at`
from `user` 
inner join `group_users`
on `user`.`id` = `group_users`.`user_id` 
where `group_id` = '03df9b0c-ca68-40bb-85ec-a230d1dd8ef3';



/* ------------------------------------ */
/* ------------ BACKUP ------------ */
/* ------------------------------------ */

/* BACKUP DO BANCO DE DADOS 22/12/2022 */
drop table if exists `tp`;
drop table if exists `solution`;
drop table if exists `group_users`;
drop table if exists `group`;
drop table if exists `user`;
create table `user` (
  `id` varchar(36) not null,
  `name` varchar(40) not null,
  `email` varchar(255) null unique,
  `cpf` varchar(11) not null unique,
  `cep` varchar(8) null,
  `created_at` timestamp not null default CURRENT_TIMESTAMP,
  `role` char(1) null comment '(d)esenvolvedor, (q)ualidade, (g)estor',
  primary key (`id`)
);
insert into `user` values('0366fc2d-e6ad-4ee4-aaff-1f95fb0ffbd2', 'Mariana Mendonça Teixeira Duarte', 'marianamtduarte@edu.unirio.br', '11111111111', '11111111', '2022-12-16 16:38:16', 'd');
insert into `user` values('17f73ca0-fd2d-4260-8090-6850d6e526d5', 'Clara Thaís Maciel e Silva', 'clarathaisms12@gmail.com', '10584182465', '22291140', '2022-12-06 11:41:31', 'd');
insert into `user` values('356bfd36-e8af-4bf4-ab5d-04a5e13a8591', 'Arlindo S. M. Junior', 'arlsjunior@edu.unirio.br', '45645644654', '66525000', '2022-12-02 04:35:24', 'd');
insert into `user` values('47c7207b-7026-4cf4-8fb0-bbf4cfd342ce', 'Yuri Gabriel Soares Campos', 'yuri.campos@edu.unirio.br', '53333333322', '20775000', '2022-12-17 18:19:12', 'd');
insert into `user` values('76eb8f26-895b-494a-8740-0995e965b16d', 'CLARA THAIS MACIEL E SILVA', 'clara.thais@edu.unirio.br', '19485764738', '28374646', '2022-12-09 20:40:10', 'd');
insert into `user` values('8ce6c4f0-ee85-481a-bea8-d684718e975f', 'Renan Barbosa De Lima', 'renanb.lima@edu.unirio.br', '12345678910', '12301751', '2022-12-08 17:34:07', 'd');
insert into `user` values('ae725de5-c7cb-436b-bb4c-aaf57add49aa', 'Pessoa de Desenvolvimento', 'desenvolvimento@ticket.io', '32132132132', '32132132', '2022-12-20 04:56:29', 'd');
insert into `user` values('d05cfd1c-a6ee-4c73-a0c5-d501172830da', 'INHESO db', 'q56384@gmail.com', '16616616616', '16616616', '2022-12-20 04:42:21', 'g');
insert into `user` values('ec58461b-4559-483d-b37a-f8a75c2d1610', 'Pessoa de Gestão', 'gestao@ticket.io', '55544433322', '55544433', '2022-12-20 04:59:04', 'g');
insert into `user` values('f3942b0e-680a-48e6-ba8c-0055ce32197a', 'Pessoa de Qualidade', 'qualidade@ticket.io', '11122233344', '11222333', '2022-12-20 04:47:47', 'q');
insert into `user` values('f71e7c14-4c99-4ebf-b01e-b4e63bd5d592', 'Junior M. Soares', 'jrmsrs2.0@gmail.com', '45678912355', '32654987', '2022-12-06 07:07:01', 'q');
create table `group` (
  `id` varchar(36) not null,
  `name` varchar(255) not null unique,
  `created_at` timestamp not null default CURRENT_TIMESTAMP,
  primary key (`id`)
);
insert into `group` values('03df9b0c-ca68-40bb-85ec-a230d1dd8ef3', 'Desenvolvedores XXXX', '2022-12-08 17:34:41');
insert into `group` values('743f58ed-6cb8-4f4d-91a0-a9ae28565dc6', 'Desenvolvedores YYYY', '2022-12-17 18:20:02');
insert into `group` values('7534c437-efe0-4983-aabf-ca76c54b573f', 'Desenvolvedores ZZZZ', '2022-12-09 20:29:37');
create table `group_users` (
  `group_id` varchar(36),
  `user_id` varchar(36),
  primary key (`user_id`, `group_id`),
  constraint `group_users_fk1` foreign key (`user_id`) references `user`(`id`) on delete cascade,
  constraint `group_users_fk2` foreign key (`group_id`) references `group`(`id`) on delete cascade
);
insert into `group_users` values('7534c437-efe0-4983-aabf-ca76c54b573f', '0366fc2d-e6ad-4ee4-aaff-1f95fb0ffbd2');
insert into `group_users` values('03df9b0c-ca68-40bb-85ec-a230d1dd8ef3', '17f73ca0-fd2d-4260-8090-6850d6e526d5');
insert into `group_users` values('7534c437-efe0-4983-aabf-ca76c54b573f', '17f73ca0-fd2d-4260-8090-6850d6e526d5');
insert into `group_users` values('03df9b0c-ca68-40bb-85ec-a230d1dd8ef3', '356bfd36-e8af-4bf4-ab5d-04a5e13a8591');
insert into `group_users` values('743f58ed-6cb8-4f4d-91a0-a9ae28565dc6', '47c7207b-7026-4cf4-8fb0-bbf4cfd342ce');
insert into `group_users` values('7534c437-efe0-4983-aabf-ca76c54b573f', '76eb8f26-895b-494a-8740-0995e965b16d');
insert into `group_users` values('743f58ed-6cb8-4f4d-91a0-a9ae28565dc6', '8ce6c4f0-ee85-481a-bea8-d684718e975f');
insert into `group_users` values('743f58ed-6cb8-4f4d-91a0-a9ae28565dc6', 'ae725de5-c7cb-436b-bb4c-aaf57add49aa');
create table `solution` (
  `id` varchar(36) not null,
  `title` varchar(100) not null,
  `details` text not null,
  `created_at` timestamp not null default current_timestamp,
  primary key (`id`)
);
create table `tp` (
  `id` varchar(36) not null,
  `group_id` varchar(36) default null,
  `title` varchar(255) not null,
  `desc` text not null,
  `dev_contact` text not null,
  `prev_conclusion` timestamp not null,
  `conclusion` timestamp null,
  `root_cause` varchar(36) default null,
  `created_at` timestamp not null default current_timestamp,
  primary key (`id`),
  key `group_id` (`group_id`),
  key `root_cause` (`root_cause`),
  constraint `tp_fk1` foreign key (`group_id`) references `group` (`id`) on delete set null,
  constraint `tp_fk2` foreign key (`root_cause`) references `solution` (`id`) on delete set null
);
insert into `tp` values('0e5a93b8-86bd-4025-ae72-6e626377d82a', '7534c437-efe0-4983-aabf-ca76c54b573f', 'Problema Www', 'Um problema w num lugar w', 'wwww', '2023-01-15 00:00:00', NULL, NULL, '2022-12-22 05:58:44');
insert into `tp` values('2d30f2ca-2b5c-46da-92b7-c5e11633c77f', '03df9b0c-ca68-40bb-85ec-a230d1dd8ef3', 'Problema Yps', 'Um problema y num lugar y', 'yyyy', '2022-12-28 00:00:00', NULL, NULL, '2022-12-22 05:57:10');
insert into `tp` values('eb77c4da-54e8-45b7-90d7-f1e3e9da9255', '03df9b0c-ca68-40bb-85ec-a230d1dd8ef3', 'Problema Xis', 'Um problema x num lugar x', 'xxxx', '2022-12-30 00:00:00', NULL, NULL, '2022-12-22 05:55:39');
