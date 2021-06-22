import ejs from 'ejs'
import pdf from 'html-pdf'
import path from 'path'
import { v4 as uuid } from 'uuid'
import { cleanDirectory } from '../helpers/clean_dir'
import { Boletim, ObjectCategory } from '../models'
import moment from 'moment'

export default {
  async create (req, res) {
    const boletim = new Boletim(req.body)
    try {
      await boletim.save()
      return res.status(201).json({
        message: 'Successfully created!'
      })
    } catch (err) {
      return res.status(500).json({
        error: err
      })
    }
  },

  async getById (req, res, next) {
    try {
      let data = await Boletim.findById(req.params.id);

      if (!data)
        return res.status('404').json({
          error: 'Not found'
        })

      return res.status(200).json({
        result: data
      })
    } catch (err) {
      return res.status('400').json({
        error: 'Could not retrieve user'
      })
    }
  },

  async getAll (req, res) {
    try {
      let data = await Boletim.find()
      res.status(200).json({ result: data })
    } catch (err) {
      return res.status(500).json({
        error: err
      })
    }
  },

  async getLatest (req, res) {
    try {
      let data = await Boletim.find()
        .sort({ _id: -1 })
        .limit(10)
        .exec()

      res.status(200).json({ result: data })
    } catch (err) {
      return res.status(500).json({
        error: err
      })
    }
  },

  async generateReport (req, res) {
    // Faz pesquisa no banco de dados para
    // retornar o boletim com o id específico
    let _boletim = await Boletim
                      .findById(req.params.id)

    // Alimenta o template com os dados retornados
    ejs.renderFile(
      path.join(__dirname, '../views/', 'report-template.ejs'),
      { boletim: _boletim, moment: moment},
      {
        cache: false
      },
      (err, data) => {
        if (err)
          res.json({ success: false, message: 'Erro ao gerar relatorio', message_details: err })

        // Com o template alimentado com sucesso, cria-se o pdf
        // a partir do template. Como o template nada mais é que um HTML
        // especial, utilizados um conversor de html para pdf do Node
  
        
        // Utilizado para gerar um valor aleatório o qual servirá 
        // de nome do arquivo temporário
        let filename = uuid()      

        // Limpamos todos os arquivos existentes atualmente na pasta
        // já que o pdf é gerado e retornado somente no ciclo de vida 
        // de uma requisição
        cleanDirectory(path.join(__dirname, '..', '..', 'storage'))

        // Função para gerar o PDF
        pdf
          .create(data, {
            scale: 0.1,
            height: '450mm',
            width: '285mm',
            header: {
              height: '0mm'
            },
            footer: {
              height: '0mm'
            }
          })
          .toFile(path.join('storage', filename + '.pdf'), function (
            err,
            data
          ) {
            if (err) {
              res.send(err)
            } else {
              
              res.json({
                message: 'File created successfully',
                url: `storage/${filename}.pdf`
              })
            }
          })
      }
    )
  },

  async update (req, res) {},

  async remove (req, res) {}
}
