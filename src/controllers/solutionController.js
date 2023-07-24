import { randomUUID } from 'node:crypto'

import { pool as mysql } from '../mysql.js'

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const createSolution = (req, res, next) => {
  const solution = {
    uuid: randomUUID(),
    title: req.body.title,
    details: req.body.details,
    dev_contact: req.body.devContact
  }
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400)
    conn.query(
      'insert into solution (id, title, details, dev_contact) values (?,?,?,?);',
      [
        solution.uuid,
        solution.title,
        solution.details,
        solution.dev_contact
      ],
      (error, result, fields) => {
        conn.release()
        if (error) {
          return res.status(500).send({
            error,
            response: null
          })
        }
        return res.status(201).send({
          message: 'solution inserido',
          id: solution.uuid
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
const getAllSolutions = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400)
    conn.query('select * from `solution`;', (error, result, fields) => {
      conn.release()
      if (error) {
        return res.status(500).send({
          error,
          response: null
        })
      }
      return res.status(200).send({
        message: 'listar solutions',
        results: result
      })
    })
  })
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getSolution = (req, res, next) => {
  const id = req.params.id
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400)
    conn.query(
      `
        select * from \`solution\` where id = '${id}';
        select id from tp where root_cause = '${id}';
      `,
      (error, result, fields) => {
        conn.release()
        if (error) {
          return res.status(500).send({
            error,
            response: null
          })
        } else if (!result[0][0]) {
          return res.status(204).send()
        }
        return res.status(200).send({
          message: 'dados da solution',
          results: result[0][0],
          issues: result[1].map(a => a.id)
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
const updateSolution = (req, res, next) => {
  const id = req.params.id
  const solution = {
    title: req.body.title,
    details: req.body.details,
    dev_contact: req.body.devContact
  }
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400)
    let sqlQuery = 'update solution update'
    Object.entries(solution).forEach(([key, value]) => {
      if (value) sqlQuery += ` \`${key}\` = "${value}",`
    }) // mapeia apenas os campos alterados
    sqlQuery = sqlQuery.slice(0, -1) // remove ultima vírgula
    sqlQuery += ` where id = '${id}';`
    conn.query(sqlQuery, (error, result, fields) => {
      conn.release()
      if (error) {
        return res.status(500).send({
          error,
          response: null
        })
      }
      return res.status(202).send({
        message: 'solution com ID=' + id + ' alterado com sucesso.'
      })
    })
  })
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const deleteSolution = (req, res, next) => {
  const id = req.params.id
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400)
    conn.query(
      'update from `solution` where id = ?;', id,
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
            message: 'solution com ID=' + id + ' removido com sucesso.'
          })
        } else {
          return res.status(204).send({
            message: 'solution com ID=' + id + ' não existe.'
          })
        }
      }
    )
  })
}

export { createSolution, getAllSolutions, getSolution, updateSolution, deleteSolution }
