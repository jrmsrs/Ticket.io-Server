const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool
const crypto = require('node:crypto')

router.post('/', (req, res, next) => {
  const user = {
    uuid: req.body.uuid || crypto.randomUUID(),
    name: req.body.name,
    email: req.body.email,
    cpf: req.body.cpf,
    cep: req.body.cep
  }
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400);
    conn.query(
      'INSERT INTO user (id, name, email, cpf, cep) VALUES (?,?,?,?,?);', 
      [user.uuid, user.name, user.email, user.cpf, user.cep],
      (error, result, fields) => {
        conn.release()
        if (error) {
          return res.status(500).send({
            error: error,
            response: null
          })
        }
        return res.status(201).send({
          message: "user inserido",
          id: user.uuid
        })
      }
    )
  })
})

router.get('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400);
    if (req.query.email) {
      const email = req.query.email
      return conn.query(
        'SELECT * FROM user WHERE email=?;', email,
        (error, result, fields) => {
          conn.release()
          if (error) {
            return res.status(500).send({
              error: error,
              response: null
            })
          }
          return res.status(200).send({
            message: "dados do user com e-mail = " + email,
            results: result[0]
          })
        }
      )
    }
    conn.query(
      'SELECT * FROM user;',
      (error, result, fields) => {
        conn.release()
        if (error) {
          return res.status(500).send({
            error: error,
            response: null
          })
        }
        return res.status(200).send({
          message: "dado dos users",
          results: result
        })
      }
    )
  })
})

router.get('/:id', (req, res, next) => {
  const id = req.params.id
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400);
    conn.query(
      'SELECT * FROM user WHERE id = ?;', id,
      (error, result, fields) => {
        conn.release()
        if (error) {
          return res.status(500).send({
            error: error,
            response: null
          })
        }
        return res.status(200).send({
          message: "dados do user",
          results: result
        })
      }
    )
  })
})

router.patch('/:id', (req, res, next) => {
  const id = req.params.id
  const user = {
    name: req.body.name,
    email: req.body.email,
    cpf: req.body.cpf,
    cep: req.body.cep
  }
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400);
    let sqlQuery = `UPDATE user SET`
    Object.entries(user).forEach(([key, value]) => {
      if (value) sqlQuery += ` ${key} = "${value}",`
    }) // mapeia apenas os campos alterados
    sqlQuery = sqlQuery.slice(0, -1) // remove ultima vírgula
    sqlQuery += ` WHERE id = '${id}'`
    conn.query(
      sqlQuery, (error, result, fields) => {
        conn.release()
        if (error) {
          return res.status(500).send({
            error: error,
            response: null
          })
        }
        return res.status(202).send({
          message: "user com ID=" + id + " alterado com sucesso."
        })
      }
    )
  })
})

router.delete('/:id', (req, res, next) => {
  const id = req.params.id
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400);
    conn.query(
      'DELETE FROM user WHERE id = ?;', id,
      (error, result, fields) => {
        conn.release()
        if (error) {
          return res.status(500).send({
            error: error,
            response: null
          })
        }
        if (result.affectedRows > 0)
          return res.status(202).send({
            message: "user com ID=" + id + " removido com sucesso."
          })
        else
          return res.status(204).send({
            message: "user com ID=" + id + " não existe."
          })
      }
    )
  })
})

module.exports = router
