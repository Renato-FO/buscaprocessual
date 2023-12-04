import { NextResponse } from 'next/server'
import { executablePath } from 'puppeteer';
import puppeteer from 'puppeteer-core'
import chrome from '@sparticuz/chromium'
import path from 'path'

export async function POST(req) {
    const { proccess } = await req.json()
    const promiseSolved = await new Promise(async (res, rej) => {
        await puppeteer.launch({
            args: ["--hide-scrollbars", "--disable-web-security", '--font-render-hinting=none'],
            defaultViewport: chrome.defaultViewport,
            executablePath: await chrome.executablePath,
            headless: true,
            ignoreHTTPSErrors: true,
            ignoreDefaultArgs: ['--disable-extensions']
        }).then(async browser => {

            const page = await browser.newPage();
            await page.setViewport({ width: 1280, height: 720 });
            await page.setExtraHTTPHeaders({
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
                'upgrade-insecure-requests': '1',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9,en;q=0.8',
            });
            await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');


            await page.goto('https://pje1g.trf3.jus.br/pje/ConsultaPublica/listView.seam', { waitUntil: "networkidle0" });

            await page.type('.value.col-sm-12 input', proccess)

            await page.click('input[type=button]')

            await page.waitForSelector('.btn.btn-default.btn-sm').then(async el => {
                const onclickValue = await page.$eval('.btn.btn-default.btn-sm', (linkElement) => {
                    // Se o elemento <a> for encontrado, retorne o valor do atributo onclick
                    return linkElement ? linkElement.getAttribute('onclick') : null;
                });

                const regex = /openPopUp\('.*?','(.*?)'\)/;
                const match = onclickValue.match(regex);

                // A constante url conterá a URL extraída
                const url = match ? match[1] : null;

                await page.goto('https://pje1g.trf3.jus.br' + url, { waitUntil: "networkidle0" })

                const extrairDadosElemento = async (selector) => {
                    const dados = await page.evaluate((sel) => {
                        const elemento = document.querySelector(sel);
                        const title = elemento?.querySelector('.propertyView .name label')?.textContent.trim() || null;
                        const text = elemento?.querySelector('.value.col-sm-12')?.textContent.trim() || null;
                        return { title, text };
                    }, selector);

                    return dados;
                };

                // Array para armazenar os objetos com os dados
                const dadosElementos = [];

                // Extrair dados para o primeiro elemento
                const objetoDadosPrimeiroElemento = await extrairDadosElemento('#j_id131\\:processoTrfViewView\\:j_id137');
                dadosElementos.push(objetoDadosPrimeiroElemento);

                // Extrair dados para o segundo elemento
                const objetoDadosSegundoElemento = await extrairDadosElemento('#j_id131\\:processoTrfViewView\\:j_id149');
                dadosElementos.push(objetoDadosSegundoElemento);

                // Extrair dados para o terceiro elemento
                const objetoDadosTerceiroElemento = await extrairDadosElemento('#j_id131\\:processoTrfViewView\\:j_id160');
                dadosElementos.push(objetoDadosTerceiroElemento);

                // Extrair dados para o quarto elemento
                const objetoDadosQuartoElemento = await extrairDadosElemento('#j_id131\\:processoTrfViewView\\:j_id171');
                dadosElementos.push(objetoDadosQuartoElemento);

                // Extrair dados para o quinto elemento
                const objetoDadosQuintoElemento = await extrairDadosElemento('#j_id131\\:processoTrfViewView\\:j_id184');
                dadosElementos.push(objetoDadosQuintoElemento);

                const objetoDadosSextoElemento = await extrairDadosElemento('#j_id131\\:processoTrfViewView\\:j_id208');
                dadosElementos.push(objetoDadosSextoElemento);

                res(dadosElementos)
            })
        })

    })
    return NextResponse.json({
        promiseSolved
    })

}