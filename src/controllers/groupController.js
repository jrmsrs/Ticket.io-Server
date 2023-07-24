import { randomUUID } from 'node:crypto'

import { pool } from '../mysql.js'

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const createGroup = (req, res, next) => {
  const group = {
    uuid: randomUUID(),
    name: req.body.name,
    users: req.body.users
  }
  let sqlQuery = `insert into \`group\` (id, name) values ('${group.uuid}','${group.name}'); `
  group.users.forEach((/** @type {string} */ userId) => {
    sqlQuery += `insert into \`group_users\` (group_id, user_id) values ('${group.uuid}', '${userId}'); `
  })
  pool.getConnection((error, conn) => {
    if (error) return res.sendStatus(400)
    conn.query(sqlQuery, (error, result, fields) => {
      conn.release()
      if (error) {
        return res.status(500).send({
          error,
          response: null
        })
      }
      return res.status(201).send({
        message: 'group inserido',
        id: group.uuid
      })
    }
    )
  })
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getAllGroups = (req, res, next) => {
  pool.getConnection((error, conn) => {
    if (error) return res.sendStatus(400)
    conn.query(
      'select * from `group`;',
      (error, result, fields) => {
        conn.release()
        if (error) {
          return res.status(500).send({
            error,
            response: null
          })
        }
        return res.status(200).send({
          message: 'listar groups',
          results: result
        })
      }
    )
  })
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getGroup = (req, res, next) => {
  const id = req.params.id
  pool.getConnection((error, conn) => {
    if (error) return res.sendStatus(400)
    if (req.query.members) {
      return conn.query(`
                select user.id, user.name, user.email, user.cep, user.created_at
                from user
                inner join group_users
                on user.id = group_users.user_id
                where group_id = ?;
                `, id,
      (error, result, fields) => {
        conn.release()
        if (error) {
          return res.status(500).send({
            error,
            response: null
          })
        }
        return res.status(200).send({
          message: 'membros do group',
          results: result
        })
      }
      )
    }
    if (req.query.issues) {
      return conn.query(`
                select id from tp where group_id = ?;
                `, id,
      (error, result, fields) => {
        conn.release()
        if (error) {
          return res.status(500).send({
            error,
            response: null
          })
        }
        return res.status(200).send({
          message: 'problemas associados ao grupo',
          results: result.map((/** @type {{ id: string; }} */ a) => a.id)
        })
      }
      )
    }
    conn.query(
      'select * from `group` where id = ?;', id,
      (error, result, fields) => {
        conn.release()
        if (error) {
          return res.status(500).send({
            error,
            response: null
          })
        }
        return res.status(200).send({
          message: 'dados do grupo',
          results: result[0]
        })
      }
    )
  })
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const updateGroup = (req, res, next) => {
  const id = req.params.id
  const users = req.body.users
  const group = {
    name: req.body.name
  }
  pool.getConnection((error, conn) => {
    if (error) return res.sendStatus(400)
    let sqlQuery = ''
    if (group.name) {
      sqlQuery += 'update `group` set'
      Object.entries(group).forEach(([key, value]) => {
        if (value) sqlQuery += ` ${key} = '${value}',`
      }) // mapeia apenas os campos alterados (exceto relacionamentos)
      sqlQuery = sqlQuery.slice(0, -1) // remove ultima vírgula

      sqlQuery += ` where id = '${id}';`
    }
    sqlQuery += ` delete from group_users where group_id = '${id}';` // exclui referencias a esse grupo
    users.forEach((/** @type {string} */ userId) => {
      sqlQuery += ` insert into group_users (group_id, user_id) values ('${id}', '${userId}');`
    }) // recria relações
    conn.query(
      sqlQuery, (error, result, fields) => {
        conn.release()
        if (error) {
          return res.status(500).send({
            error,
            response: null
          })
        }
        return res.status(202).send({
          message: 'group com ID=' + id + ' alterado com sucesso.'
        })
      }
    )
  })
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const deleteGroup = (req, res, next) => {
  const id = req.params.id
  pool.getConnection((error, conn) => {
    if (error) return res.sendStatus(400)
    conn.query(
      'delete from `group` where id = ?;', id,
      (error, result, fields) => {
        conn.release()
        if (error) {
          return res.status(500).send({
            error,
            response: null
          })
        }
        if (result.affectedRows > 0) {
          return res.status(202).send({
            message: 'group com ID=' + id + ' removido com sucesso.'
          })
        } else {
          return res.status(204).send({
            message: 'group com ID=' + id + ' não existe.'
          })
        }
      }
    )
  })
}

export { createGroup, getAllGroups, getGroup, updateGroup, deleteGroup }
