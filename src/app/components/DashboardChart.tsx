"use client";

import React from "react";
import { Chart, Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Registra os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface DashboardChartProps {
  data: any[];
}

const DashboardChart: React.FC<DashboardChartProps> = ({ data }) => {
  // Rótulos do eixo X: "Dias desde o início" (1, 2, 3, ...)
  const labels = data.map((_, index) => (index + 1).toString());

  // ----- GRÁFICO DE CIMA: Calorias e Médias -----
  // Calorias totais por sessão
  const totalCalories = data.map((item) => parseFloat(item.Kcal_Total));

  // Calorias acumuladas (soma cumulativa)
  const cumulativeKcal: number[] = [];
  totalCalories.reduce((acc, val, i) => {
    cumulativeKcal[i] = acc + val;
    return acc + val;
  }, 0);

  // Média móvel com período 3 (para os dois primeiros pontos, usamos null)
  const movingAvg = totalCalories.map((_, i) => {
    if (i < 2) return null;
    return (totalCalories[i - 2] + totalCalories[i - 1] + totalCalories[i]) / 3;
  });

  // Dados para o gráfico de cima
  const topChartData = {
    labels,
    datasets: [
      {
        type: "bar" as const,
        label: "Calorias Totais",
        data: totalCalories,
        backgroundColor: "rgba(75,192,192,0.6)",
        yAxisID: "y",
      },
      {
        type: "line" as const,
        label: "Média Móvel (3)",
        data: movingAvg,
        borderColor: "rgba(0,0,0,1)",
        borderDash: [5, 5],
        fill: false,
        tension: 0.1,
        yAxisID: "y",
      },
      {
        type: "line" as const,
        label: "Kcal Acumuladas",
        data: cumulativeKcal,
        borderColor: "rgba(255,206,86,1)",
        fill: false,
        tension: 0.1,
        yAxisID: "y2",
      },
    ],
  };

  const topChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Calorias Totais e Acumuladas" },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Dias desde o início",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Calorias",
        },
      },
      y2: {
        beginAtZero: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false, // Remove as linhas de grade do eixo secundário
        },
        title: {
          display: true,
          text: "Kcal Acumuladas",
        },
      },
    },
  };

  // ----- GRÁFICO DE BAIXO: Distâncias -----
  const runningDistance = data.map((item) =>
    parseFloat(item.Distancia_Corrida)
  );
  const cyclingDistance = data.map((item) =>
    parseFloat(item.Distancia_Bike)
  );
  // Soma das distâncias de corrida e bike
  const totalDistance = data.map(
    (_, i) => runningDistance[i] + cyclingDistance[i]
  );

  const bottomChartData = {
    labels,
    datasets: [
      {
        type: "bar" as const,
        label: "Distância Total (km)",
        data: totalDistance,
        backgroundColor: "rgba(100,100,100,0.3)",
        borderWidth: 1,
      },
      {
        type: "line" as const,
        label: "Distância Corrida (km)",
        data: runningDistance,
        borderColor: "rgba(255,99,132,1)",
        fill: false,
        tension: 0.1,
      },
      {
        type: "line" as const,
        label: "Distância Bike (km)",
        data: cyclingDistance,
        borderColor: "rgba(54,162,235,1)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const bottomChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Distâncias: Corrida e Bike" },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Dias desde o início",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Distância (km)",
        },
      },
    },
  };

  // ----- GRÁFICO DE PIZZA: Comparação de Calorias Corrida vs. Bike -----
  const totalKcalCorrida = data.reduce(
    (acc, curr) => acc + parseFloat(curr.Kcal_Corrida),
    0
  );
  const totalKcalBike = data.reduce(
    (acc, curr) => acc + parseFloat(curr.Kcal_Bike),
    0
  );

  const pieData = {
    labels: ["Corrida", "Bike"],
    datasets: [
      {
        data: [totalKcalCorrida, totalKcalBike],
        backgroundColor: [
          "rgba(255,99,132,0.7)",
          "rgba(54,162,235,0.7)",
        ],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "Comparação de Calorias Queimadas",
      },
      datalabels: {
        formatter: (value: number, context: any) => {
          const dataArray = context.chart.data.datasets[0].data;
          const sum = dataArray.reduce(
            (a: number, b: number) => a + b,
            0
          );
          const percentage = ((value * 100) / sum).toFixed(2) + "%";
          return percentage;
        },
        color: "#fff",
      },
    },
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Gráficos de Desempenho</h2>

      {/* Gráfico de Cima */}
      <div className="mb-8" style={{ height: 300 }}>
        <Chart data={topChartData} options={topChartOptions} />
      </div>

      {/* Gráfico de Baixo */}
      <div className="mb-8" style={{ height: 300 }}>
        <Chart data={bottomChartData} options={bottomChartOptions} />
      </div>

      {/* Gráfico de Pizza */}
      <div className="mb-8" style={{ height: 300 }}>
        <Pie data={pieData} options={pieOptions} />
      </div>
    </div>
  );
};

export default DashboardChart;