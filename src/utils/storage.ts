class StoreManager<Prefix extends string> {
    #prefix: string;
    constructor(pref: Prefix) {
        this.#prefix = pref;
    }
    getVal(key: string): string {
        return localStorage.getItem(`${this.#prefix}||${key}`) as string;
    }
    setVal(key: string, val: string): void {
        localStorage.setItem(`${this.#prefix}||${key}`, val);
    }
    removeVal(key: string): void {
        localStorage.removeItem(`${this.#prefix}||${key}`);
    }
}

export { StoreManager };
