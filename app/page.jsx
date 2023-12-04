
"use client"
import { useState } from 'react'
import { useRouter } from 'next/router';
import axios from 'axios'

export default function Home() {
  
  const [proccess, setProccess] = useState(''),
    [infos, setInfos] = useState([]);
  
  function handleChange(e) {
    let valorFormatado = e.target.value.replace(/(\d{7})(\d{2})(\d{4})(\d{2})(\d{1})(\d{4})/, "$1-$2.$3.$4.$5$6");
    setProccess(valorFormatado)
  }

  const informations = () => {
    if(infos.length > 0){
      return (
        <div>
          {infos.map((info) => {
            <div>
              <h2>{info.title}: <span>{info.text}</span></h2>
            </div>
          })}
        </div>
      )
    }
  }

  async function getProccess(){
    axios.create({
      baseURL: 'https://buscaprocessual.vercel.app/'
    })
    const res = await axios.post('api', {
      proccess
    })
    if(res.data.promiseSolved){
      setInfos(res.data.promiseSolved)
    }
    console.log(res.data.promiseSolved)
  }

  return (
    <main className="flex flex-col w-full h-full items-center justify-center">
      <h1 className="text-5xl font font-semibold">Vtec Pesquisar Processos</h1>
      <h2 className="text-3xl mt-20">TRF3</h2>
      <h3 className="text-2xl mt-6">Processos anteriores à 2013</h3>

      <div className="flex flex-col mt-6">
        <label className="font-bold">Número do processo</label>
        <input type="text" maxLength={25} value={proccess} onChange={handleChange} className="border-2 border-gray-300 rounded-md h-10 w-96 px-2" />
      </div>
      <button onClick={getProccess} className="bg-blue-400 text-white font-semibold py-2 px-5 rounded-md mt-4">Pesquisa</button>

      {
        infos.length > 0 ?
        <div className='mt-10'>
              {infos.map((info) => {
                return(
            <div>
              <h2><span className='font-bold'>{info.title}:</span> {info.text}</h2>
            </div>)
          })}
            </div>
            : <div></div>
      }
    </main>
  )
}
