class KVCache {
    constructor(){
        this.store = new Map()
        setInterval(() => {
            for (const [key, entry] of this.store){
                if(Date.now() > entry.expiresAt){
                    this.store.delete(key)
                }
            }
        }, 5000);
    }
    set(key, value, ttl){
        const expiresAt = Date.now() + ttl
        this.store.set(key, {value, expiresAt })
    }
    get(key){
        if(!this.store.has(key)){
            return null
        }
        const entry = this.store.get(key)

        if(Date.now() > entry.expiresAt){
            this.store.delete(key)
            return null
        }
        return entry.value
    }
    delete(key){
        this.store.delete(key)
    }
}
