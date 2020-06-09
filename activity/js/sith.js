
class sith {
  constructor() {
    this.type = 'Sith'
    this.name = 'S' + parseInt(Math.random() * 10).toString()
    this.status = 'alive'
    this.stamina = parseInt(Math.random() * 500) + 500
    this.powers = [
      this.forceLightening,
      this.bleeding,
      this.transferEssence,
      this.forceChoke,
      this.forceDrain
    ]
  }

  hit(power) {
    this.stamina -= power;
    if (this.stamina < 0) {
      this.status = 'dead'
    }
  }

  forceLightening() {
    let power = parseInt(Math.random() * 500)
    return {
      'message': 'force lightening with power ' + power,
      'power': power
    }
  }

  bleeding() {
    let power = parseInt(Math.random() * 500)
    return {
      'message': 'bleeding with power ' + power,
      'power': power
    }
  }

  transferEssence() {
    let power = parseInt(Math.random() * 500)
    return {
      'message': 'transfer essence with power ' + power,
      'power': power
    }
  }

  forceChoke() {
    let power = parseInt(Math.random() * 500)
    return {
      'message': 'force choke with power ' + power,
      'power': power
    }
  }

  forceDrain() {
    let power = parseInt(Math.random() * 500)
    return {
      'message': 'force drain with power ' + power,
      'power': power
    }
  }

  connect() {
    this.localdb = window.indexedDB.open('clonewars', 1);
    this.localdb.onupgradeneeded = async (e) => {
      let objectStore;
      this.localdb = e.target.result;
      objectStore = this.localdb.createObjectStore('fighters', { keyPath: 'id' });
      objectStore.createIndex('object', 'object');
    };
    this.localdb.onsuccess = async (e) => {
      if (this.localdb.constructor.name == 'IDBOpenDBRequest') {
        this.localdb = this.localdb.result;
      }
      this.ready = true;
    };
  }

  async clear(id) {
    return this.delayWrapper((resolve, reject) => {
      let transaction = this.localdb.transaction(['fighters'], 'readwrite').objectStore('fighters').clear();
      transaction.onsuccess = async () => resolve(transaction.result);
      transaction.onerror = async () => reject(transaction.result);
    });
  }

  async delayWrapper(callback) {
    return new Promise((resolve, reject) => {
      return setTimeout(() => {
        callback(resolve, reject);
      }, (this.ready) ? 0 : 100);
    });
  }

  async write() {
    return this.delayWrapper(async (resolve, reject) => {
      let item = {
        'object': {
          'type': this.type,
          'name': this.name,
          'stamina': this.stamina,
          'status': this.status
        }
      }
      item.id = await this.generateUniqueDbKey()
      let transaction = this.localdb.transaction(['fighters'], 'readwrite').objectStore('fighters').put(item);
      transaction.onsuccess = async () => resolve(transaction.result);
      transaction.onerror = async () => reject(transaction.result);
    });
  }

  async read(id) {
    return this.delayWrapper((resolve, reject) => {
      let transaction = this.localdb.transaction(['fighters'], 'readonly').objectStore('fighters').get(id);
      transaction.onsuccess = async () => resolve(transaction.result);
      transaction.onerror = async () => reject(transaction.result);
    });
  }

  async show() {
    return this.delayWrapper((resolve, reject) => {
      let toReturn = {};
      this.localdb.transaction('fighters').objectStore('fighters').openCursor().onsuccess = function (e) {
        let cursor = e.target.result;
        if (cursor) {
          if (cursor.key.startsWith('SITH')) {
            toReturn[cursor.key] = cursor.value;
          }
          cursor.continue();
        } else {
          resolve(toReturn);
        }
      }
    });
  }

  async generateUniqueDbKey() {
    let newId;
    let iterator;
    do {
      newId = 'SITH' + parseInt(Math.random() * 1000000);
      iterator = await this.read(newId);
    } while (iterator);
    return newId;
  }

}
