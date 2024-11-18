    // Fetch goals data for player ranking
    fetch('/api/goals')
        .then(response => response.json())
        .then(data => {
            const rankingDivs = document.querySelectorAll('.club-goal');
            data.forEach((rankData, idx) => {
                rankingDivs[idx].innerHTML = `
                    <h4>Rank ${rankData.rank}</h4>
                    <h2>${rankData.club}</h2>
                    <p>${rankData.goals} Goals</p>
                `;
            });
        })
        .catch(error => console.error('Error fetching goals data:', error));