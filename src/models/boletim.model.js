import mongoose from 'mongoose'

const BoletimSchema = new mongoose.Schema(
  {
    mike: {
      type: String,
      index: true
    },
    matricula: {
      type: String,
      index: true
    },
    responsavel: String,
    tipoOcorr: String,
    endereco: String,
    date: Date,
    hrregistro: String,
    dataFato: Date,
    descr_natureza: String,
    gt: { type: String, default: "" },
    efetivo: { type: String, default: "" },
    pessoas: [
    {
        pai: String,
        mae: String,
        data_nascimento: String,
        idade_aparente: String,
        escolaridade: String,
        endereco: String,
        endereco_numero: String,
        endereco_complemeneto: String,
        naturalidade: { type: String, default: "" },
        rg: { type: String, default: "" },
        cpf: { type: String, default: "" },
        telefone: { type: String, default: "" },
        tipo: { type: String, default: "" },
      },
    
   ],
    objetos: [
      {
        tipo_objeto: { type: mongoose.Schema.ObjectId, ref: 'object_category' },
        tipo_objeto_category: String,
        qtd_objeto: String,
        vlr_objeto: String,
        envolvido: { type: String, default: "" },
        modelo: { type: String, default: "" },
        nserie: { type: String, default: "" },
        histórico: { type: String, default: "" },
      }
    ]
  },
  {
    timestamps: true,
    strict: false // Novos conteúdos além dos que aqui especificados poderão ser adicionados
  }
)

const Boletim = mongoose.model('boletim', BoletimSchema)
export default Boletim
