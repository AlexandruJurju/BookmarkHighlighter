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

    // steam search old list
    if (currentUrl.startsWith("https://store.steampowered.com/search/")) {
        const elements = document.getElementsByClassName("title");
        applyStyles(elements);
    }

    // steam 250
    if (currentUrl.startsWith("https://steam250.com/")) {
        const elements = document.querySelectorAll(".title a");
        applyStyles(elements);
    }

    // use increment to get correct elements for site
    // when using the see all games increment should be 7, else 9
    if (currentUrl.startsWith("https://steamdb.info")) {
        let increment;
        if (currentUrl === "https://steamdb.info/stats/gameratings/?all") {
            increment = 7;
        } else {
            increment = 9;
        }

        const elements = document.getElementsByTagName("td");
        const selectedElements = [];

        for (let i = 2; i < elements.length; i += increment) {
            selectedElements.push(elements[i]);
        }

        // Now, call the applyStyles function with the selected elements list
        applyStyles(selectedElements);
    }

    if (currentUrl.startsWith("https://steamdb.info/instantsearch")) {
        const elements = document.getElementsByClassName("ais-Highlight-nonHighlighted");
        applyStyles(elements);
    }

}, 5000);
