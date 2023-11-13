const getTeams = async () => {
    try {
        return await (await fetch("/api/teams")).json();
    } catch (error) {
        console.log(error);
    }
};

const showTeams = async () => {
    try {
        let teams = await getTeams();
        let teamsDiv = document.getElementById("team-list");
        teamsDiv.innerHTML = "";
        teams.forEach((team) => {
            const section = document.createElement("section");
            section.classList.add("team");
            teamsDiv.append(section);

            const a = document.createElement("a");
            a.href = "#";
            section.append(a);

            const h3 = document.createElement("h1");
            h3.innerHTML = `${team.name}`;
            a.append(h3);

            a.onclick = (e) => {
                e.preventDefault();
                displayDetails(team);
            };
        });
    } catch (error) {
        console.log(error);
    }
};


const displayDetails = (team) => {
    const teamDetails = document.getElementById("team-details");
    teamDetails.innerHTML = "";

    const h3 = document.createElement("h3");
    h3.innerHTML = `${team.name} - ${team.city}`;
    teamDetails.append(h3);

    const p = document.createElement("p");
    teamDetails.append(p);
    p.innerHTML = `Super Bowl Wins: ${team.superBowlWins}, Stadium: ${team.stadium}`;

    const playersList = document.createElement("ul");
    teamDetails.append(playersList);

    team.players.forEach((player) => {
        const li = document.createElement("li");
        playersList.append(li);
        li.innerHTML = player;
    });

    populateForm(team);
};

const populateForm = (team) => {
    const form = document.getElementById("add-team-form");
    form._id.value = team._id;
    form.name.value = team.name;
    form.city.value = team.city;
    form.logo.value = team.logo;
    form.superBowlWins.value = team.superBowlWins;
    form.players.value = team.players.join(", ");
    form.stadium.value = team.stadium;
};

const addTeam = async (e) => {
    e.preventDefault();
    const form = document.getElementById("add-team-form");
    const formData = new FormData(form);

    formData.delete("_id");

    let response = await fetch("/api/teams", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        console.log("Error posting data");
    } else {
        response = await response.json();
        resetForm();
        document.querySelector(".dialog").classList.add("transparent");
        showTeams();
    }
};

const resetForm = () => {
    const form = document.getElementById("add-team-form");
    form.reset();
    form._id.value = "-1";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-title").innerHTML = "Add Team";
    resetForm();
};

window.onload = () => {
    showTeams();
    document.getElementById("add-team-form").onsubmit = addTeam;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };
};

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".dialog").classList.remove("transparent");
    document.querySelector(".dialog").classList.add("transparent");
});