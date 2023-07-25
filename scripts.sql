/* ----------------------------------- */
/* ------------ SQL CREATE ----------- */
/* ----------------------------------- */

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `cpf` varchar(11) NOT NULL,
  `cep` varchar(8) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `role` char(1) DEFAULT 'd' COMMENT '(d)ev, (q)a, (g)manager',
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8

DROP TABLE IF EXISTS `group`;
CREATE TABLE `group` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8

DROP TABLE IF EXISTS `group_users`;
CREATE TABLE `group_users` (
  `group_id` varchar(36) NOT NULL DEFAULT '',
  `user_id` varchar(36) NOT NULL DEFAULT '',
  PRIMARY KEY (`user_id`, `group_id`),
  KEY `group_users_fk2` (`group_id`),
  CONSTRAINT `group_users_fk1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `group_users_fk2` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8

DROP TABLE IF EXISTS `solution`;
CREATE TABLE `solution` (
  `id` varchar(36) NOT NULL,
  `title` varchar(100) NOT NULL,
  `details` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dev_contact` text NOT NULL,
  `author` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `author` (`author`),
  CONSTRAINT `solution_fk1` FOREIGN KEY (`author`) REFERENCES `user` (`id`) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8

DROP TABLE IF EXISTS `tp`;
CREATE TABLE `tp` (
  `id` varchar(36) NOT NULL,
  `group_id` varchar(36) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `desc` text NOT NULL,
  `dev_contact` text NOT NULL,
  `prev_conclusion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `conclusion` timestamp NULL DEFAULT NULL,
  `root_cause` varchar(36) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `incidents_count` smallint(6) NOT NULL DEFAULT '1',
  `author` varchar(36) DEFAULT NULL,
  `drive_doc_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`),
  KEY `root_cause` (`root_cause`),
  KEY `author` (`author`),
  CONSTRAINT `tp_fk0` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  CONSTRAINT `tp_fk2` FOREIGN KEY (`root_cause`) REFERENCES `solution` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  CONSTRAINT `tp_fk3` FOREIGN KEY (`author`) REFERENCES `user` (`id`) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8

/* ---------------------------------------- */
/* ------------ COMMON QUERIES ------------ */
/* ---------------------------------------- */

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
