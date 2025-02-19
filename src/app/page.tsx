"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import DashboardChart from "./components/DashboardChart";
import StreakCounter from "./components/StreakCounter";

export default function Home() {
  const [data, setData] = useState<any[]>([]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Lê o arquivo como ArrayBuffer
      const dataBuffer = await file.arrayBuffer();

      // Lê o workbook
      const workbook = XLSX.read(dataBuffer);

      // Pega a primeira planilha (ajuste se desejar outra)
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Converte a planilha para JSON
      // IMPORTANTE: Certifique-se de que a 1ª linha da planilha contenha os nomes das colunas.
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      // Atualiza o estado com os dados lidos
      setData(jsonData);
    } catch (error) {
      console.error("Erro ao ler o arquivo:", error);
    }
  };

  return (
    <main className="bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">
        Dashboard de Corridas
      </h1>
      <p className="text-lg mb-4">
        Faça o upload da planilha com os dados das corridas (XLS ou XLSX):
      </p>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFile}
        className="mb-4 text-black"
      />
      {data.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-2">Dados Carregados:</h2>
          <table className="w-full border-collapse text-left mb-8">
            <thead>
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th
                    key={key}
                    className="border border-gray-700 px-4 py-2 bg-gray-800 text-white"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.keys(row).map((key) => (
                    <td
                      key={key}
                      className="border border-gray-700 px-4 py-2"
                    >
                      {row[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <DashboardChart data={data} />
        </div>
      )}
      <h1>
      <StreakCounter/>
    </h1>
    </main>
  );
}
