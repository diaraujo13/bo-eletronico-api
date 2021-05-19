import ejs from 'ejs';
import pdf from 'html-pdf'
import path from 'path'

import { Boletim } from '../models';

export default {
	async create (req, res)  {
		const boletim = new Boletim(req.body);
		try {
			await boletim.save();
			return res.status(201).json({
				message: 'Successfully created!'
			});
		} catch (err) {
			return res.status(500).json({
				error: err
			});
		}
	},

	async getById (req, res, next, id)  {
		try {
			let boletim = await Boletim.findById(id);
			if (!boletim)
				return res.status('404').json({
					error: 'Not found'
				});
		} catch (err) {
			return res.status('400').json({
				error: 'Could not retrieve user'
			});
		}
	},

	async getAll (req, res)  {
		try {
			let categories = await Boletim.find();
			res.status(200).json(categories);
		} catch (err) {
			return res.status(500).json({
				error: err
			});
		}
	},

	async generateReport ( req, res ) {

		let _boletim = await Boletim.findById(req.params._id);
		console.log(__dirname)

		ejs.renderFile(path.join(__dirname, '../views/', "report-template.ejs"), {}, (err, data) => {
			if (err)
				res.json({ success: false, message: 'Erro ao gerar relatorio'})

			// com o dado retornado com sucesso, cria-se o B.O
			pdf.create(data,  {
				"height": "11.25in",
				"width": "8.5in",
				"header": {
					"height": "20mm"
				},
				"footer": {
					"height": "20mm",
				},
			}).toFile("report.pdf", function (err, data) {
				if (err) {
					res.send(err);
				} else {
					res.send(data);
				}
			});
		});

	},

	async update (req, res)  {
	
	},

	async remove (req, res)  {
		
	}
};
