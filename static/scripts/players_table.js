let allPlayersData = []; // Store all players data

// Fetch player data for the table
fetch('/api/players')
    .then(response => response.json())
    .then(data => {
        allPlayersData = data; // Store all players data
        updateTable(allPlayersData.slice(0, 10)); // Show only first 10 players initially
    })
    .catch(error => console.error('Error fetching players data:', error));

// Function to update the table with the given players data
function updateTable(players) {
    const tableBody = document.querySelector('#playersTable tbody');
    tableBody.innerHTML = ''; // Clear previous data

    players.forEach(player => {
        const row = `
            <tr>
                <td>${player.player_name}</td>
                <td>${player.club}</td>
                <td>${player.position}</td>
                <td>${player.minutes_played}</td>
                <td>${player.match_played}</td>
                <td>${player.goals}</td>
                <td>${player.assists}</td>
                <td>${player.distance_covered}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Filter players table based on search input
document.getElementById('searchPlayer').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    const filteredPlayers = allPlayersData.filter(player =>
        player.player_name.toLowerCase().includes(searchValue)
    );
    updateTable(filteredPlayers.slice(0, 10)); // Update table with filtered players
});

document.getElementById('searchClub').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    const filteredPlayers = allPlayersData.filter(player =>
        player.club.toLowerCase().includes(searchValue)
    );
    updateTable(filteredPlayers.slice(0, 10)); // Update table with filtered players
});
