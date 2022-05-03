const btns = [PAD_SELECT, PAD_START, PAD_UP, PAD_RIGHT, PAD_DOWN, PAD_LEFT, PAD_TRIANGLE, PAD_CIRCLE, PAD_CROSS, PAD_SQUARE, PAD_L1, PAD_R1, PAD_L2, PAD_R2, PAD_L3, PAD_R3];

let isPressed = {},
    hasClicked = {},
    hasInteracted = {},
    steps = {},
    forceReleased = {},
    old = current = Pads.get();

function release(btn) {
    hasClicked[btn] = false;
    hasInteracted[btn] = false;
    isPressed[btn] = false;
    steps[btn] = 0;
    forceReleased[btn] = true;
}

function capture() {
    current = Pads.get();

    btns.forEach(function (btn) {
        const now = Pads.check(current, btn);
        const prev = Pads.check(old, btn);

        if (!now && prev && !isPressed[btn] && !forceReleased[btn]) {
            hasClicked[btn] = true;
            steps[btn] = 0;
        }
        else if (now && prev && steps[btn] == env.MAX_PRESS_STEPS && !forceReleased[btn]) {
            hasClicked[btn] = false;
            isPressed[btn] = true;
        }
        else if (now && prev && steps[btn] < env.MAX_PRESS_STEPS && !forceReleased[btn]) {
            steps[btn]++;
        }
        else if (!now && !prev) {
            hasClicked[btn] = false;
            isPressed[btn] = false;
            forceReleased[btn] = false;
            steps[btn] = 0;
        }

        if (now && !forceReleased[btn]) {
            hasInteracted[btn] = true;
        }
        else {
            hasInteracted[btn] = false;
        }
    });

    old = current;
}

module.exports = {
    capture,
    release,
    clicked: function (btn) {
        return hasClicked[btn];
    },
    pressed: function (btn) {
        return isPressed[btn];
    },
    interacted: function (btn) {
        return hasInteracted[btn];
    }
}