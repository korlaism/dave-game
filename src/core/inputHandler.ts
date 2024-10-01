export interface KeyState {
    [key: string]: boolean;
}

export class InputHandler {
    keys: KeyState;

    constructor() {
        this.keys = {};
        window.addEventListener("keydown", (event) => {
            this.keys[event.key] = true;
        });
        window.addEventListener("keyup", (event) => {
            this.keys[event.key] = false;
        });
    }

    getKeyState(): KeyState {
        return this.keys;
    }
}