(() => {
    /*
    Bruh...
     */

    const width = 600;
    const height = 500;

    const plot = {
        target: "#plot",
        width,
        height,
        yAxis: {
            label: "Tryout success",
            domain: [0, height / 500]
        },
        xAxis: {
            label: "Shot percentage",
            domain: [0, width / 600]
        },
        grid: false,
        data: [
            {fn: "x^4+4*x^3*(1-x)+6*x^2*(1-x)^2", color: "steelblue"},
            {fn: "x^6+6*x^5*(1-x)+15*x^4*(1-x)^2+20*x^3*(1-x)^3", color: "orange"}
        ],
        disableZoom: true
    };
    functionPlot(plot);
})();
