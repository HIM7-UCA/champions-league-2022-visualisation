
let goalsChart;  // Chart instance

    const clubSelect = document.getElementById('club-select');
    const ctx = document.getElementById('goalsChart').getContext('2d');

    // Fetch the clubs for the dropdown
    fetch('/api/goals_by_club')
        .then(response => response.json())
        .then(data => {
            const clubs = data.clubs;

            // Populate the dropdown with clubs
            clubs.forEach(club => {
                const option = document.createElement('option');
                option.value = club;
                option.text = club;
                clubSelect.add(option);
            });

            // Set default chart data for "Bayern"
            fetchGoalsForClub('Bayern');
        })
        .catch(error => console.error('Error fetching clubs:', error));

    // Event listener for club selection
    clubSelect.addEventListener('change', function () {
        const selectedClub = clubSelect.value;
        if (selectedClub) {
            fetchGoalsForClub(selectedClub);
        }
    });

    // Function to fetch and display goals for the selected club
    function fetchGoalsForClub(club) {
        fetch(`/api/goals_by_club/${club}`)
            .then(response => response.json())
            .then(data => {
                const playerLabels = [];
                const goalsData = [];

                data.players.forEach(player => {
                    playerLabels.push(player.player_name);
                    goalsData.push(player.goals);
                });

                if (goalsChart) {
                    goalsChart.destroy();
                }

                goalsChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: playerLabels,
                        datasets: [{
                            label: 'Goals Scored',
                            data: goalsData,
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Players'
                                }
                            },
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Goals Scored'
                                }
                            }
                        },
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    title: () => club
                                }
                            }
                        }
                    }
                });
            })
            .catch(error => console.error('Error fetching goals data:', error));
    }
