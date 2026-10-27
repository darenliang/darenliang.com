(() => {
    /*
     * Makes Plotly charts follow the site's light/dark color scheme.
     * Loaded right after the Plotly script so the wrappers are in place
     * before any chart is created; re-applies on scheme changes.
     *
     * Also keeps chart text from being chopped off: Plotly sizes the axis
     * margins by measuring text, and charts drawn before the webfont loads
     * measure a narrower fallback font, so longer labels overflow the plot
     * once the real font swaps in. Charts are therefore drawn once the
     * webfont is ready.
     */

    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const colors = () =>
        mq.matches
            ? {
                  bg: "#1C1C1C",
                  ink: "#CCCCCC",
                  grid: "#2E2E2E",
                  zero: "#444444"
              }
            : {
                  bg: "#FFFFFF",
                  ink: "#333333",
                  grid: "#E5E5E5",
                  zero: "#CCCCCC"
              };

    // merges the theme colors into a layout without touching
    // the settings of an individual chart
    const themedLayout = (layout) => {
        const c = colors();
        const l = layout || {};
        return Object.assign({}, l, {
            paper_bgcolor: c.bg,
            plot_bgcolor: c.bg,
            font: Object.assign({}, l.font, { color: c.ink }),
            xaxis: Object.assign({}, l.xaxis, {
                gridcolor: c.grid,
                zerolinecolor: c.zero,
                linecolor: c.grid
            }),
            yaxis: Object.assign({}, l.yaxis, {
                gridcolor: c.grid,
                zerolinecolor: c.zero,
                linecolor: c.grid
            }),
            legend: Object.assign({}, l.legend, {
                font: Object.assign({}, l.legend && l.legend.font, {
                    color: c.ink
                })
            }),
            hoverlabel: Object.assign({}, l.hoverlabel, {
                bgcolor: c.bg,
                bordercolor: c.grid,
                font: Object.assign({}, l.hoverlabel && l.hoverlabel.font, {
                    color: c.ink
                })
            })
        });
    };

    // re-theme charts that are already rendered
    const apply = () => {
        if (!window.Plotly) {
            return;
        }
        const c = colors();
        document.querySelectorAll(".js-plotly-plot").forEach((graph) => {
            Plotly.relayout(graph, {
                paper_bgcolor: c.bg,
                plot_bgcolor: c.bg,
                "font.color": c.ink,
                "xaxis.gridcolor": c.grid,
                "xaxis.zerolinecolor": c.zero,
                "xaxis.linecolor": c.grid,
                "yaxis.gridcolor": c.grid,
                "yaxis.zerolinecolor": c.zero,
                "yaxis.linecolor": c.grid,
                "legend.font.color": c.ink,
                "hoverlabel.bgcolor": c.bg,
                "hoverlabel.bordercolor": c.grid,
                "hoverlabel.font.color": c.ink
            });
        });
    };

    // charts are measured with this font; before it loads, text falls back to
    // a narrower font and the axis margins end up too small. Plotly caches the
    // measurements it takes (and a later redraw reuses them), so the only fix
    // is to draw the charts with the real font in place.
    const fontReady = () =>
        !document.fonts || document.fonts.check('12px "Commit Mono"');

    const whenFontReady = () => {
        if (fontReady()) {
            return Promise.resolve();
        }
        return document.fonts
            .load('12px "Commit Mono"')
            .then(() => {}, () => {});
    };

    // theme charts at creation time
    const install = () => {
        if (!window.Plotly || Plotly.__siteTheme) {
            return;
        }
        Plotly.__siteTheme = true;
        ["newPlot", "react"].forEach((name) => {
            const original = Plotly[name];
            if (typeof original !== "function") {
                return;
            }
            Plotly[name] = function (gd, data, layout, ...rest) {
                const config = Object.assign({ responsive: true }, rest[0]);
                const draw = () =>
                    original.call(
                        this,
                        gd,
                        data,
                        themedLayout(layout),
                        config,
                        ...rest.slice(1)
                    );
                // defer the first draw until the webfont is ready so the
                // labels have room instead of being chopped off
                return whenFontReady().then(draw);
            };
        });
    };

    install();
    apply();
    mq.addEventListener("change", apply);
})();
