const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool
const crypto = require('node:crypto')

router.post('/', (req,res,next) => {
    const group = {
        uuid: crypto.randomUUID(),
        name: req.body.name,
        users: req.body.users,
    } 
    let sqlQuery = `INSERT INTO \`group\` (id, name) VALUES ('${group.uuid}','${group.name}'); `
    group.users.forEach(userId => {
        sqlQuery += `INSERT INTO group_users (group_id, user_id) VALUES ('${group.uuid}', '${userId}'); `
    })
    mysql.getConnection((error, conn) => {
        if (error) return res.sendStatus(400);
        conn.query(sqlQuery, (error,result,fields) => {
                conn.release()
                if (error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                } 
                return res.status(201).send({
                    message: "group inserido",
                    id: group.uuid
                })
            }
        )
    })
})

router.get('/', (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.sendStatus(400);
        conn.query(
            'SELECT * FROM `group`;',
            (error,result,fields) => {
                conn.release()
                if (error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                } 
                return res.status(200).send({
                    message: "listar groups",
                    results: result
                })
            }
        )
    })
})

router.get('/:id', (req,res,next) => {
    const id = req.params.id
    mysql.getConnection((error, conn) => {
        if (error) return res.sendStatus(400);
        if(req.query.members){
            return conn.query(`
                select user.id, user.name, user.email, user.cep, user.created_at
                from user
                inner join group_users
                on user.id = group_users.user_id
                where group_id = ?;
                `,id,
                (error,result,fields) => {
                    conn.release()
                    if (error){
                        return res.status(500).send({
                            error: error,
                            response: null
                        })
                    } 
                    return res.status(200).send({
                        message: "membros do group",
                        results: result
                    })
                }
            )
        }
        conn.query(
            'SELECT * FROM \`group\` WHERE id = ?;',id,
            (error,result,fields) => {
                conn.release()
                if (error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                } 
                return res.status(200).send({
                    message: "dados do grupo",
                    results: result[0]
                })
            }
        )
    })
})

router.patch('/:id', (req,res,next) => {
    const id = req.params.id
    const users = req.body.users
    const group = {
        name: req.body.name,
    }
    mysql.getConnection((error, conn) => {
        if (error) return res.sendStatus(400);
        let sqlQuery = ``
        if (group.name) {
            sqlQuery += `UPDATE \`group\` SET`
            Object.entries(group).forEach(([key, value]) => {
                if (value) sqlQuery += ` ${key} = '${value}',`
            }) // mapeia apenas os campos alterados (exceto relacionamentos)
            sqlQuery = sqlQuery.slice(0, -1) // remove ultima vírgula
            
            sqlQuery += ` WHERE id = '${id}';`
        }
        sqlQuery += ` DELETE FROM group_users WHERE group_id = '${id}';` // exclui referencias a esse grupo
        users.forEach(userId => {
            sqlQuery += ` INSERT INTO group_users (group_id, user_id) VALUES ('${id}', '${userId}');`
        }) // recria relações
        conn.query(
            sqlQuery,(error,result,fields) => {
                conn.release()
                if (error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                } 
                return res.status(202).send({
                    message: "group com ID="+ id +" alterado com sucesso."
                })
            }
        )
    })
})

router.delete('/:id', (req,res,next) => {
    const id = req.params.id
    mysql.getConnection((error, conn) => {
        if (error) return res.sendStatus(400);
        conn.query(
            'DELETE FROM `group` WHERE id = ?;',id,
            (error,result,fields) => {
                conn.release()
                if (error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                } 
                if (result.affectedRows>0)
                    return res.status(202).send({
                        message: "group com ID="+ id +" removido com sucesso."
                    })
                else 
                    return res.status(204).send({
                        message: "group com ID="+ id +" não existe."
                    })
            }
        )
    })
})

module.exports = router
