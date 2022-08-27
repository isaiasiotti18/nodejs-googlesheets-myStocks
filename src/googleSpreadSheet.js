import { GoogleSpreadsheet } from 'google-spreadsheet'
import { credentials } from '../google-sheets-api-credentials.js'
import fs from 'fs'


const docId = '1l4ulx9Gp0VsYY9HKwdpP4bKL_ScxU3ltXSQrgo2B5jc';
const doc = new GoogleSpreadsheet(docId);
doc.useServiceAccountAuth({
  client_email: credentials.client_email,
  private_key: credentials.private_key
})
await doc.loadInfo();
const getSheet = doc.sheetsByIndex[0];

const readFile = fs.readFileSync('./acoes.json', 'utf8');

const arrayAcoes = JSON.parse(readFile);

console.log(arrayAcoes.length)

export const sleep = time => new Promise(resolve => {
  setInterval(resolve, time)
})

// for await (const acao of arrayAcoes) {
//   await getSheet.addRow({
//     NOME: acao.nome,
//     CODIGO: acao.codigo
//   })
//   await sleep(5000)
//   console.log('Preenchendo a planilha...')
// }

const rows = await getSheet.getRows()
rows[0].VALOR = 'teste'
rows[0].save()


for (let i = 2, countRow = 0; i < rows.length; i++, countRow++) {
  rows[countRow].VALOR = `=SEERRO(GOOGLEFINANCE(B${i}; "price"); 0)`
  await rows[countRow].save()
  await sleep(2000)
}

