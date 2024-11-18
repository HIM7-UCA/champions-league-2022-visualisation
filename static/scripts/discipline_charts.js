// Load player list into dropdown on page load
window.addEventListener('DOMContentLoaded', () => {
    fetch('/api/players')  // Assuming there's an endpoint to get all player names
        .then(response => response.json())
        .then(players => {
            const playerSelect = document.getElementById('player-select');
            const searchInput = document.getElementById('player-search');

            // Populate the dropdown with players
            players.forEach(player => {
                const option = document.createElement('option');
                option.value = player.player_name;
                option.textContent = player.player_name;
                playerSelect.appendChild(option);
            });

            // Set "Ronaldo" as the default player if available, otherwise first player
            const defaultPlayer = players.find(player => player.player_name === 'Ronaldo') || players[0];
            if (defaultPlayer) {
                playerSelect.value = defaultPlayer.player_name;  // Set the selected value in the dropdown
                updateCharts(defaultPlayer.player_name);  // Load the charts for Ronaldo or the first player
            }

            // Add search input event listener
            searchInput.addEventListener('input', function () {
                const searchTerm = this.value.toLowerCase();
                const options = playerSelect.options;

                // Filter options based on search term
                for (let i = 0; i < options.length; i++) {
                    const option = options[i];
                    const isVisible = option.textContent.toLowerCase().includes(searchTerm);
                    option.style.display = isVisible ? 'block' : 'none';  // Show/hide options
                }
            });
        })
        .catch(error => console.error('Error loading players:', error));
});

// Update charts when a player is selected
document.getElementById('player-select').addEventListener('change', function () {
    const selectedPlayer = this.value;
    console.log('Player selected:', selectedPlayer);
    updateCharts(selectedPlayer);
});

// Function to fetch and update charts for a specific player
function updateCharts(playerName) {
    console.log('Fetching discipline data for', playerName);

    fetch(`/api/discipline/${playerName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching data for player: ${playerName}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Discipline data for player:', data);

            // Pie chart data with updated colors
            const pieData = {
                labels: ["Fouls Committed", "Fouls Suffered", "Red Cards", "Yellow Cards"],
                datasets: [{
                    label: 'Discipline Overview',
                    data: [data.fouls_committed, data.fouls_suffered, data.red, data.yellow],
                    backgroundColor: ['#088F8F', '#9c27b0', '#ff0000', '#ffd700'], // Green, Purple, Red, Yellow
                    hoverOffset: 4
                }]
            };

            // Bar chart data with updated colors
            const barData = {
                labels: [data.player_name], // Single player name
                datasets: [
                    {
                        label: 'Fouls Committed',
                        data: [data.fouls_committed],
                        backgroundColor: '#088F8F' // bleu
                    },
                    {
                        label: 'Fouls Suffered',
                        data: [data.fouls_suffered],
                        backgroundColor: '#9c27b0' // Purple
                    },
                    {
                        label: 'Red Cards',
                        data: [data.red],
                        backgroundColor: '#ff0000' // Red
                    },
                    {
                        label: 'Yellow Cards',
                        data: [data.yellow],
                        backgroundColor: '#ffd700' // Yellow
                    }
                ]
            };

            // Render pie chart
            const pieCtx = document.getElementById('pieChart').getContext('2d');
            if (window.pieChart instanceof Chart) {
                window.pieChart.destroy(); // Destroy previous chart if exists
            }
            window.pieChart = new Chart(pieCtx, {
                type: 'pie',
                data: pieData,
                options: {
                    responsive: true
                }
            });

            // Render bar chart
            const barCtx = document.getElementById('barChart').getContext('2d');
            if (window.barChart instanceof Chart) {
                window.barChart.destroy(); // Destroy previous chart if exists
            }
            window.barChart = new Chart(barCtx, {
                type: 'bar',
                data: barData,
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
        .catch(error => console.error('Error fetching player discipline data:', error));
}
