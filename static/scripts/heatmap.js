let teams = [];
let players = [];
let defendingStats = [];
let attackingStats = [];
let goalkeepingStats = [];
let goalsStats = [];
let selectedTeam = "All";
let selectedType = "Attack";

document.addEventListener("DOMContentLoaded", fetchStats);

async function fetchStats() {
    try {
        const [defendingRes, attackingRes, goalkeepingRes, goalsRes] = await Promise.all([
            fetch('/api/defending').then(res => res.json()),
            fetch('/api/attacking').then(res => res.json()),
            fetch('/api/goalkeeping').then(res => res.json()),
            fetch('/api/goals').then(res => res.json()),
        ]);

        defendingStats = defendingRes;
        attackingStats = attackingRes;
        goalkeepingStats = goalkeepingRes;
        goalsStats = goalsRes;

        teams = [...new Set(defendingStats.map(stat => stat.club)), ...new Set(attackingStats.map(stat => stat.club)), ...new Set(goalkeepingStats.map(stat => stat.club))];
        populateTeamDropdown();
        updateHeatmap();
    } catch (error) {
        console.log("Error fetching stats:", error);
    }
}

function populateTeamDropdown() {
    const teamSelect = document.getElementById('teamSelect');
    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team;
        option.textContent = team;
        teamSelect.appendChild(option);
    });
    teamSelect.addEventListener('change', function () {
        selectedTeam = this.value;
        updateHeatmap();
    });
}

function toggleType(type) {
    selectedType = type;
    updateHeatmap();
    document.getElementById('attackBtn').style.fontWeight = (type === 'Attack') ? 'bold' : 'normal';
    document.getElementById('defenceBtn').style.fontWeight = (type === 'Defence') ? 'bold' : 'normal';
    document.getElementById('goalkeepingBtn').style.fontWeight = (type === 'Goalkeeping') ? 'bold' : 'normal';
}

function updateHeatmap() {
    const filteredStats = filterStats();
    const seriesData = getStats(filteredStats);
    renderHeatmap(seriesData);
}

function filterStats() {
    let filteredStats = [];
    if (selectedType === "Defence") filteredStats = defendingStats;
    else if (selectedType === "Attack") filteredStats = attackingStats;
    else if (selectedType === "Goalkeeping") filteredStats = goalkeepingStats;

    if (selectedTeam !== "All") filteredStats = filteredStats.filter(stat => stat.club === selectedTeam);
    return filteredStats;
}

function getStats(filteredStats) {
    return filteredStats.map(stat => {
        const data = subCategories[selectedType].map(key => ({
            x: key,
            y: stat[key] || 0
        }));
        return { name: stat.player_name, data };
    });
}

const subCategories = {
    Attack: ["goals", "assists", "corner_taken", "offsides", "dribbles"],
    Defence: ["goals", "t_won", "t_lost", "clearance_attempted", "balls_recovered"],
    Goalkeeping: ["saved", "conceded", "clean_sheets", "punches_made"]
};

function renderHeatmap(seriesData) {
    const options = {
        chart: { type: 'heatmap', toolbar: { show: true } },
        plotOptions: {
            heatmap: {
                shadeIntensity: 0.5,
                colorScale: {
                    ranges: [
                        { from: 0, to: 5, name: 'Low', color: '#E5F0FF' },
                        { from: 5, to: 10, name: 'Medium', color: '#99C2FF' },
                        { from: 10, to: 20, name: 'High', color: '#3385FF' },
                        { from: 20, to: 100, name: 'Very High', color: '#0052CC' }
                    ]
                }
            }
        },
        xaxis: { categories: subCategories[selectedType] },
        series: seriesData
    };

    const chart = new ApexCharts(document.querySelector("#heatmapChart"), options);
    chart.render();
}
