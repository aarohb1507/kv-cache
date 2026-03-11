class KVStore {
  constructor() {
    this.store = new Map();
    this.transactions = [];
    this.DELETED = Symbol('deleted');
  }
  begin() {
    this.transactions.push(new Map());
  }
  set(key, value) {
    if (this.transactions.length === 0) {
      this.store.set(key, value);
    } else {
      const top = this.transactions.length - 1;
      const topTxn = this.transactions[top];
      topTxn.set(key, value);
    }
  }
  rollback() {
    if (this.transactions.length === 0) {
      throw new Error('Transactions empty');
    } else {
      this.transactions.pop();
    }
  }
  get(key) {
    for (let i = this.transactions.length - 1; i >= 0; i--) {
      if (this.transactions[i].has(key)) {
        const value = this.transactions[i].get(key);
        if (value === this.DELETED) {
          return null;
        } else {
          return value;
        }
      }
    }
    if (this.store.has(key)) {
      return this.store.get(key);
    } else {
      throw new Error('the key doesnt exist');
    }
  }
  commit() {
    if (this.transactions.length === 0) {
      throw new Error('transactions empty');
    } else {
      const topTxn = this.transactions.pop();
      if (this.transactions.length === 0) {
        for (const [key, value] of topTxn) {
          this.store.set(key, value);
        }
      } else {
        const parent = this.transactions[this.transactions.length - 1];
        for (const [key, value] of topTxn) {
          parent.set(key, value);
        }
      }
    }
  }
  delete(key) {
    if (this.transactions.length === 0) {
      this.store.delete(key);
    } else {
      const topTxn = this.transactions[this.transactions.length - 1];
      topTxn.set(key, this.DELETED);
    }
  }
}
