import { randomUUID } from 'node:crypto'
import { google } from 'googleapis'
import { Readable } from 'stream'

import { pool } from '../mysql.js'

const drive = google.drive('v3')

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const createIssue = (req, res, next) => {
  const issue = {
    uuid: randomUUID(),
    group: req.body.group,
    title: req.body.title,
    desc: req.body.desc,
    devContact: req.body.devContact,
    prevConclusion: req.body.prevConclusion,
    incidentsCount: req.body.incidentsCount,
    author: req.body.author
  }
  pool.getConnection((error, conn) => {
    if (error) return res.sendStatus(400)
    conn.query(
      'insert into tp (id, group_id, title, `desc`, dev_contact, prev_conclusion, incidents_count, author) values (?,?,?,?,?,?,?,?);',
      [ issue.uuid, issue.group, issue.title, issue.desc, issue.devContact, issue.prevConclusion, issue.incidentsCount, issue.author ],
      (error, result, fields) => {
        conn.release()
        if (error) {
          return res.status(500).send({
            error,
            response: null
          })
        }
        return res.status(201).send({
          message: 'issue inserido',
          id: issue.uuid
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
const getAllIssues = (req, res, next) => {
  pool.getConnection((error, conn) => {
    if (error) return res.sendStatus(400)
    conn.query('select * from `tp`;', (error, result, fields) => {
      conn.release()
      if (error) {
        return res.status(500).send({
          error,
          response: null
        })
      }
      return res.status(200).send({
        message: 'listar issues',
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
const getIssue = (req, res, next) => {
  const id = req.params.id
  pool.getConnection((error, conn) => {
    if (error) return res.sendStatus(400)
    conn.query(
      'select * from `tp` where id = ?;',
      id,
      (error, result, fields) => {
        conn.release()
        if (error) {
          return res.status(500).send({
            error,
            response: null
          })
        }
        return res.status(200).send({
          message: 'dados da issue',
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
const updateIssue = async (req, res, next) => {
  const id = req.params.id
  const issue = {
    group_id: req.body.group,
    title: req.body.title,
    desc: req.body.desc,
    dev_contact: req.body.devContact,
    prev_conclusion: req.body.prevConclusion,
    conclusion: req.body.conclusion,
    root_cause: req.body.rootCause,
    incidents_count: req.body.incidentsCount
  }
  if (req.query.upload) {
    const upload = async () => {
      try {
        // Authenticate with the Service Account
        const auth = new google.auth.GoogleAuth({
          credentials: JSON.parse(process.env.DRIVEAPI_KEY ?? ''),
          scopes: ['https://www.googleapis.com/auth/drive']
        })

        // Read the file to be uploaded
        const file = req.files?.file

        // Create the file metadata
        const fileMetadata = {
          // @ts-ignore
          name: file?.name,
          parents: [process.env.DRIVEAPI_DIR_ID]
        }

        // Upload the file
        // @ts-ignore
        const upload = await drive.files.create({
          auth,
          resource: fileMetadata,
          media: {
            // @ts-ignore
            body: Readable.from(Buffer.from(file?.data, 'base64'))
          }
        })
        // @ts-ignore
        return upload.data.id
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error uploading file' })
        return null
      }
    }

    await upload()
      .then((driveDocId) => {
        pool.getConnection((error, conn) => {
          if (error) return res.sendStatus(400)
          return conn.query(`update tp set drive_doc_id = '${driveDocId}' where id = '${id}'`,
            (error, result, fields) => {
              conn.release()
              if (error) {
                return res.status(500).send({
                  error,
                  response: null
                })
              }
              return res.status(202).send({
                message: 'upload efetuado. issue com ID=' + id + ' associado ao arquivo id = ' + driveDocId + '.'
              })
            })
        })
      })
    return
  }
  pool.getConnection((error, conn) => {
    if (error) return res.sendStatus(400)
    if (req.query.reincident) {
      return conn.query(`
        update tp 
        set incidents_count = incidents_count + ${issue.incidents_count}, conclusion = null, root_cause = null
        where id = '${id}';
      `,
      (error, result, fields) => {
        conn.release()
        if (error) {
          return res.status(500).send({
            error,
            response: null
          })
        }
        return res.status(202).send({
          message: 'issue com ID=' + id + ' alterado com sucesso.'
        })
      })
    }

    let sqlQuery = 'update tp set'
    Object.entries(issue).forEach(([key, value]) => {
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
        message: 'issue com ID=' + id + ' alterado com sucesso.'
      })
    })
  })
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const deleteIssue = (req, res, next) => {
  const id = req.params.id
  pool.getConnection((error, conn) => {
    if (error) return res.sendStatus(400)
    conn.query(
      'delete from `tp` where id = ?;', id,
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
            message: 'issue com ID=' + id + ' removido com sucesso.'
          })
        } else {
          return res.status(204).send({
            message: 'issue com ID=' + id + ' não existe.'
          })
        }
      }
    )
  })
}

export { createIssue, getAllIssues, getIssue, updateIssue, deleteIssue }
