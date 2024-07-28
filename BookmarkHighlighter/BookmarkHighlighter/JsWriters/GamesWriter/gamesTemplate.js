const intervalId = window.setInterval(function () {
    const currentUrl = window.location.href;
    const font_size = "20px";
    const font_color = "white";
    const game_color = "#008000";
    const early_color = "#1034A6";
    const not_played_color = "#a71930";
    const waiting_color = "#666666"


    function applyStyles(elements) {
        for (let i = 0; i < elements.length; i++) {
            const textContent = elements[i].textContent.replace("amp", '').replace(/(?!\w|\s)./g, '').replace(/™/g, '').trim().toLowerCase();
            elements[i].style.fontSize = font_size;
            elements[i].style.color = font_color;

            if (Normal.includes(textContent)) {
                elements[i].style.backgroundColor = game_color;
            } else if (Early.includes(textContent)) {
                elements[i].style.backgroundColor = early_color;
            } else if (Waiting.includes(textContent)) {
                elements[i].style.backgroundColor = waiting_color;
            } else {
                elements[i].style.backgroundColor = not_played_color;
            }
        }
    }


    switch (true) {
        case currentUrl.startsWith("https://store.steampowered.com/search/"):
            colorSteam();
            break;
        case currentUrl.startsWith("https://steam250.com/"):
            colorSteam250();
            break;
        case currentUrl.startsWith("https://steamdb.info/"):
            colorSteamDb(currentUrl);
            break;
        default:
            break;
    }


    function colorSteam() {
        console.log("colorSteam")

        const elements = document.getElementsByClassName("title");
        applyStyles(elements);
    }

    function colorSteam250() {
        console.log("colorSteam250")

        const elements = document.querySelectorAll(".title a");
        applyStyles(elements);
    }

    function colorSteamDb(currentUrl) {
        console.log("colorSteamDb");
        console.log(currentUrl);

        if (currentUrl.startsWith("https://steamdb.info/stats/gameratings")) {
            // Check if there's a year after "gameratings"
            const match = currentUrl.match(/gameratings\/(\d{4})/);
            if (match) {
                // If there's a year, use colorSteamDbGamesByYear
                colorSteamDbGamesByYear();
            } else {
                // If there's no year, use colorSteamDbAllFavoriteGames
                colorSteamDbAllFavoriteGames();
            }
        } else if (currentUrl.startsWith("https://steamdb.info/charts/")) {
            colorSteamDbAllFavoriteGames();
        } else {
            colorSteamDbGamesByYear();
        }
    }
r

    function colorSteamDbAllFavoriteGames() {
        console.log("steamDbFavorite")

        increment = 7;

        const elements = document.getElementsByTagName("td");
        const selectedElements = [];

        for (let i = 2; i < elements.length; i += increment) {
            selectedElements.push(elements[i]);
        }

        applyStyles(selectedElements);
    }

    function colorSteamDbGamesByYear() {
        console.log("steamDbGamesByYear")
        const elements = document.getElementsByClassName("b");
        applyStyles(elements);
    }

    function colorSteamDbInstasearch() {
        console.log("steamDbInstaSearch")
        const elements = document.getElementsByClassName("ais-Highlight-nonHighlighted");
        applyStyles(elements);
    }

}, 5000);
