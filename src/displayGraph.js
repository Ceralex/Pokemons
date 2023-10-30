export function displayGraph(stats) {
	const baseStats = stats.map(stat => stat.base_stat);

	const chartData = {
		labels: [
			"HP",
			"Attack",
			"Defense",
			"Special Attack",
			"Special Defense",
			"Speed",
		],
		datasets: [
			{
				label: "Stats",
				data: baseStats,
				fill: true,
				backgroundColor: "rgba(255, 99, 132, 0.2)",
				borderColor: "rgb(255, 99, 132)",
				pointBackgroundColor: "rgb(255, 99, 132)",
				pointBorderColor: "#fff",
				pointHoverBackgroundColor: "#fff",
				pointHoverBorderColor: "rgb(255, 99, 132)",
			},
		],
	};

	const config = {
		type: "radar",
		data: chartData,
		options: {
			scales: {
				r: {
					angleLines: {
						display: false,
					},
					grid: {
						color: "white",
					},
					pointLabels: {
						color: "white",
					},
					suggestedMin: 0,
					suggestedMax: Math.max(baseStats), // Adattabile in base al pokemon
				},
			},
		},
	};
	new Chart(document.getElementById("myChart"), config);
}
