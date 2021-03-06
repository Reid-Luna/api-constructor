const express = require('express')
const app = express()


const cors = require('cors')
app.use(cors())

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const mongoose = require('mongoose')

let portlist = []

let modelName


class API {

	constructor(model, oldschema, port, dbName) {

		modelName = model

		const db = mongoose.connect(`mongodb://localhost:27017/${dbName}`)

		app.get(`/${model}`, (req, res) => {
			this[model+'get'](res)
		});

		app.get(`/${model}/:id`, (req, res) => {
			this[model+'getById'](req, res)
		})

		app.post(`/${model}`, (req, res) => {
			this[model+'post'](req, res)
		});

		app.put(`/${model}/:id`, (req, res) => {
			this[model+'put'](req, res)
		});

		app.delete(`/${model}/:id`, (req, res) => {
			this[model+'delete'](req, res)
		});


		let schema = new mongoose.Schema(oldschema)
		this[model] = mongoose.model(model, schema)


		this[model+'get'] = (res) => {
			this[model].find({}, (err, result) => {
				if (err){
					res.send(err)
				} else {
					res.json(result)
				}
			})
		}

		this[model+'getById'] = (req, res) => {
			let id = req.params.id
			this[model].findById(id, (err, result) => {
				if (err) {
					res.send(err)
				} else {
					res.json(result)
				}
			})
		}

		this[model+'post'] = (req, res) => {
			this[model].create(req.body, (err, result) => {
				if (err) {
					res.send(err)
				} else {
					res.json(result)
				}
			})
		}

		this[model+'put'] = (req, res) => {
			let toSet = req.body.toSet
			let data = req.body.data
			let id = req.params.id
			let query = {
				[toSet]: data
			}
			this[model].findByIdAndUpdate(id, query, {new:true}, (err, result) => {
				if (err) {
					res.send(err)
				} else {
					res.json(result)
				}
			})
		}

		this[model+'delete'] = (req, res) => {
			let id = req.params.id
			this[model].findByIdAndRemove(id, (err, result) => {
				if (err) {
					res.send(err)
				} else {
					res.json(result)
				}
			})
		}

		if (portlist.indexOf(port) <= -1){
			app.listen(port, (err) => {
				if (err){
					console.err
				} else {
					console.log(`${model} API running on port ${port}`)
				}
			})

			portlist.push(port)
		} else {
			console.log(`${model} API running on port ${port}`)
		}

	}
}

module.exports = API
