const nexusIntervalId = window.setInterval(function () {
    const font_size = "20px";
    const font_color = "white";
    const border_color = "#008000";  // Green color for the border
    const border_width = "10px";  // Width of the border
    const border_style = "solid";  // Style of the border

    function applyStyles(modTile) {
        if (modTile) {
            // Add a green border to the mod tile
            modTile.style.border = `${border_width} ${border_style} ${border_color}`;

            // Ensure the border is visible by adding some padding
            modTile.style.padding = "5px";

            // Style the tile name (assuming it's in an element with class 'tile-name')
            const tileName = modTile.querySelector('.tile-name a');
            if (tileName) {
                tileName.style.fontSize = font_size;
                tileName.style.color = font_color;
            }
        }
    }

    function colorModTile(href) {
        const modTile = document.querySelector(`.mod-tile-left a[href="${href}"]`);
        if (modTile) {
            const tileElement = modTile.closest('.mod-tile-left');
            if (tileElement) {
                applyStyles(tileElement);
            }
        }
    }

    // Apply styling to each mod in the list
    mods.forEach(modUrl => {
        colorModTile(modUrl);
    });
}, 1000);  // Run every 1000 milliseconds (1 second)
