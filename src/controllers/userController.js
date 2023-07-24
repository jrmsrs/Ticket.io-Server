import { randomUUID } from 'node:crypto'

import { pool as mysql } from '../mysql.js'

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const createUser = (req, res, next) => {
  const user = {
    uuid: req.body.uuid || randomUUID(),
    name: req.body.name,
    email: req.body.email,
    cpf: req.body.cpf,
    cep: req.body.cep
  }
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400)
    conn.query(
      'insert into user (id, name, email, cpf, cep) values (?,?,?,?,?);',
      [user.uuid, user.name, user.email, user.cpf, user.cep],
      (error, result, fields) => {
        conn.release()
        if (error) {
          return res.status(500).send({
            error,
            response: null
          })
        }
        return res.status(201).send({
          message: 'user inserido',
          id: user.uuid
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
const getAllUsers = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400)
    if (req.query.email) {
      const email = req.query.email
      return conn.query(
        'select * from user where email=?;', email,
        (error, result, fields) => {
          conn.release()
          if (error) {
            return res.status(500).send({
              error,
              response: null
            })
          }
          return res.status(200).send({
            message: 'dados do user com e-mail = ' + email,
            results: result[0]
          })
        }
      )
    }
    conn.query(
      'select * from user;',
      (error, result, fields) => {
        conn.release()
        if (error) {
          return res.status(500).send({
            error,
            response: null
          })
        }
        return res.status(200).send({
          message: 'dado dos users',
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
const getUser = (req, res, next) => {
  const id = req.params.id
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400)
    conn.query(
      'select * from user where id = ?;', id,
      (error, result, fields) => {
        conn.release()
        if (error) {
          return res.status(500).send({
            error,
            response: null
          })
        }
        return res.status(200).send({
          message: 'dados do user',
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
const updateUser = (req, res, next) => {
  const id = req.params.id
  const user = {
    name: req.body.name,
    email: req.body.email,
    cpf: req.body.cpf,
    cep: req.body.cep
  }
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400)
    let sqlQuery = 'update user update'
    Object.entries(user).forEach(([key, value]) => {
      if (value) sqlQuery += ` ${key} = "${value}",`
    }) // mapeia apenas os campos alterados
    sqlQuery = sqlQuery.slice(0, -1) // remove ultima vírgula
    sqlQuery += ` where id = '${id}'`
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
          message: 'user com ID=' + id + ' alterado com sucesso.'
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
const deleteUser = (req, res, next) => {
  const id = req.params.id
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400)
    conn.query(
      'update from user where id = ?;', id,
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
            message: 'user com ID=' + id + ' removido com sucesso.'
          })
        } else {
          return res.status(204).send({
            message: 'user com ID=' + id + ' não existe.'
          })
        }
      }
    )
  })
}

export { createUser, getAllUsers, getUser, updateUser, deleteUser }
