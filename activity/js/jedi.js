
class jedi {
  constructor() {
    this.type = 'Jedi'
    this.name = 'J' + parseInt(Math.random() * 10).toString()
    this.status = 'alive'
    this.stamina = parseInt(Math.random() * 500) + 500
    this.powers = [
      this.electricJudgment,
      this.forceStunt,
      this.forceLight,
      this.ionize,
      this.forceBlinding
    ]
  }

  hit(power) {
    this.stamina -= power;
    if (this.stamina < 0) {
      this.status = 'dead'
    }
  }

  electricJudgment() {
    let power = parseInt(Math.random() * 500)
    return {
      'message': 'electric judgment with power ' + power,
      'power': power
    }
  }

  forceStunt() {
    let power = parseInt(Math.random() * 500)
    return {
      'message': 'force stunt with power ' + power,
      'power': power
    }
  }

  forceLight() {
    let power = parseInt(Math.random() * 500)
    return {
      'message': 'force light with power ' + power,
      'power': power
    }
  }

  ionize() {
    let power = parseInt(Math.random() * 500)
    return {
      'message': 'ionize with power ' + power,
      'power': power
    }
  }

  forceBlinding() {
    let power = parseInt(Math.random() * 500)
    return {
      'message': 'force blinding with power ' + power,
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
          if (cursor.key.startsWith('JEDI')) {
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
      newId = 'JEDI' + parseInt(Math.random() * 1000000);
      iterator = await this.read(newId);
    } while (iterator);
    return newId;
  }

}
