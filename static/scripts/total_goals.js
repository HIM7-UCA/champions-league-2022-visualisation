    // Fetch the total goals by club and render the first chart
    fetch('/api/total_goals_by_club')
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('clubsBarChart').getContext('2d');
            const clubNames = data.map(item => item.club);
            const totalGoals = data.map(item => item.total_goals);

            // Display club statistics in the cards
            const topClub = data[0];
            const secondTopClub = data[1];
            const lowestClub = data[data.length - 1];

            document.getElementById('topClubName').textContent = topClub.club;
            document.getElementById('topClubGoals').textContent = `${topClub.total_goals} Goals`;

            document.getElementById('secondTopClubName').textContent = secondTopClub.club;
            document.getElementById('secondTopClubGoals').textContent = `${secondTopClub.total_goals} Goals`;

            document.getElementById('lowestClubName').textContent = lowestClub.club;
            document.getElementById('lowestClubGoals').textContent = `${lowestClub.total_goals} Goals`;

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: clubNames,
                    datasets: [{
                        label: 'Total Goals',
                        data: totalGoals,
                        backgroundColor: '#8884d8',
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching total goals by club:', error));

    // Fetch the goals by position for each club and render the stacked bar chart
    fetch('/api/goals_by_position')
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('positionsBarChart').getContext('2d');
            const clubNames = data.map(item => item.club);
            const forwardGoals = data.map(item => item.Forward || 0);
            const midfielderGoals = data.map(item => item.Midfielder || 0);
            const defenderGoals = data.map(item => item.Defender || 0);

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: clubNames,
                    datasets: [{
                        label: 'Forward',
                        data: forwardGoals,
                        backgroundColor: '#8884d8',
                        stack: 'positions'
                    }, {
                        label: 'Midfielder',
                        data: midfielderGoals,
                        backgroundColor: '#82ca9d',
                        stack: 'positions'
                    }, {
                        label: 'Defender',
                        data: defenderGoals,
                        backgroundColor: '#ffc658',
                        stack: 'positions'
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            stacked: true
                        },
                        y: {
                            stacked: true,
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    const clubName = tooltipItem.chart.data.labels[tooltipItem.dataIndex];
                                    const forwardGoals = tooltipItem.chart.data.datasets[0].data[tooltipItem.dataIndex];
                                    const midfielderGoals = tooltipItem.chart.data.datasets[1].data[tooltipItem.dataIndex];
                                    const defenderGoals = tooltipItem.chart.data.datasets[2].data[tooltipItem.dataIndex];

                                    // Custom tooltip with club name and goals by position in list format
                                    return [
                                        `Club: ${clubName}`,
                                        `Forward: ${forwardGoals}`,
                                        `Midfielder: ${midfielderGoals}`,
                                        `Defender: ${defenderGoals}`
                                    ];
                                }
                            },
                            backgroundColor: '#f5f5f5',
                            titleColor: '#333',
                            bodyColor: '#666',
                            borderColor: '#ccc',
                            borderWidth: 1,
                            padding: 10,
                            bodyFont: {
                                size: 14
                            }
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching goals by position:', error));