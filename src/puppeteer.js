import puppeteer from 'puppeteer';
import fs from 'fs';

async function runPuppeteer() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://valorinveste.globo.com/cotacoes/')
  
  const listAcoes = await page.evaluate(() => {
    const nodeList = document.querySelectorAll('table tbody tr');

    const data = [...nodeList]
    const list = data.map(item => {
      const splitItem = item.innerText.split('\t');

      return {
        nome: splitItem[0],
        codigo: splitItem[1],
      }
    });

    return list;
  })

  fs.writeFile('acoes.json', JSON.stringify(listAcoes), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  })

  await browser.close();
  
}
runPuppeteer();