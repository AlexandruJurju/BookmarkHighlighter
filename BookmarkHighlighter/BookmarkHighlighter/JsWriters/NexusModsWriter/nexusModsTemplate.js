const nexusIntervalId = window.setInterval(function () {
    const font_size = "20px";
    const font_color = "white";
    const downloaded_color = "#008000";  // Green color for downloaded mods
    const not_downloaded_color = "#a71930";  // Red color for not downloaded mods
    const border_width = "10px";
    const border_style = "solid";

    function applyStyles(modTile, isDownloaded) {
        if (modTile) {
            const borderColor = isDownloaded ? downloaded_color : not_downloaded_color;
            modTile.style.border = `${border_width} ${border_style} ${borderColor}`;
            modTile.style.padding = "5px";

            const tileName = modTile.querySelector('.tile-name a');
            if (tileName) {
                tileName.style.fontSize = font_size;
                tileName.style.color = font_color;
            }
        }
    }

    function colorModTiles() {
        const allModTiles = document.querySelectorAll('.mod-tile-left');
        allModTiles.forEach(tileElement => {
            const modLink = tileElement.querySelector('a');
            if (modLink) {
                const href = modLink.getAttribute('href');
                const isDownloaded = mods.includes(href);
                applyStyles(tileElement, isDownloaded);
            }
        });
    }

    colorModTiles();
}, 1000);  // Run every 1000 milliseconds (1 second)