class KVStore {
  constructor() {
    this.store = new Map();
    this.transactions = [];
  }
  begin() {
    this.transactions.push(new Map());
  }
  rollback() {
    if (this.transactions.length === 0) {
      throw new Error('No transactions present');
    }
    this.transactions.pop();
  }
  set(key, value) {
    if (this.transactions.length > 0) {
      const top = this.transactions[this.transactions.length - 1];
      top.set(key, value);
    } else {
      this.store.set(key, value);
    }
  }
  get(key) {
    for (let i = this.transactions.length - 1; i >= 0; i--) {
      if (!this.transactions[i].has(key) && !this.store.has(key)) {
        throw new Error('The key doesnt exist');
      }
    }
  }
  commit() {
    if (this.transactions.length === 0) {
      throw new Error('No transactions present');
    }
    const topTxn = this.transactions.pop();
    if (this.transactions.length > 0) {
      for (const [key, value] of topTxn) {
        const parent = this.transactions[this.transactions.length - 1];
        parent.set(key, value);
      }
    } else {
      for (const [key, value] of topTxn) {
        this.store.set(key, value);
      }
    }
  }
}
