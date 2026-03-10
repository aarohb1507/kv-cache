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
    for(let i in this.transactions)
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
  delete(key) {
    if (this.transactions.length === 0) {
      throw new Error('No transactions');
    }
    const top = this.transactions[this.transactions.length - 1];
    if (top.has(key)) {
      top.set(key, DELETED);
    } else {
      throw new Error('Key doenst exist');
    }
  }
}
