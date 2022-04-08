(() => {
    const percentageInput = document.getElementById("winPercentage");
    const proportionInput = document.getElementById("winProportion");
    const result = document.getElementById("result");

    window["calculate"] = () => {
        const percentage = parseFloat(percentageInput.value);
        if (!(0 < percentage && percentage < 1)) {
            result.innerHTML = "Enter a win percentage between 0 and 1 (non-inclusive).<br>&nbsp";
            return;
        }

        const proportion = parseFloat(proportionInput.value);
        if (!(0 < proportion)) {
            result.innerHTML = "Enter a positive win proportion.<br>&nbsp";
            return;
        }

        const wager = percentage + ((percentage - 1) / proportion);
        console.log(wager);
        if (Math.abs(wager) < 10 * Number.EPSILON) {
            result.innerHTML = `You have zero edge.<br>You should wager <b>nothing</b>.`;
            return;
        }

        if (wager > 0) {
            result.innerHTML = `You have a positive edge.<br>The optimal wager size is <b>${wager.toFixed(4)}</b>.`;
            return;
        }

        result.innerHTML = `You have a negative edge and should take the other side of the bet.<br>The optimal wager size for the other side of the bet is <b>${-wager.toFixed(4)}</b>.`;
    };
})();
