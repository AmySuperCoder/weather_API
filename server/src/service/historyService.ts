import fs from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TODO: Define a City class with name and id properties

export class City {
  name=""
  id=""
  constructor(name: string, id: string){
    this.name=name
    this.id=id
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  history = []

  // TODO: Define a read method that reads from the searchHistory.json file
    async read() {
    const history = fs.readFileSync(path.join(__dirname, '../../db/searchHistory.json'), {encoding: 'utf-8'})
    const historyJson = JSON.parse(history)
    this.history=historyJson
    return historyJson
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file



  async write(cities: City[]) {
    const historyJson=await this.read()
    historyJson.push(...cities)
    const historyString=JSON.stringify(historyJson)
    fs.writeFileSync(path.join(__dirname, '../../db/searchHistory.json'), historyString)
    this.history=historyJson
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file



   async removeCity(id: string) {
    const historyJson=await this.read()
    const filteredHistory=historyJson.filter((city: City) => {
      return city.id !== id
    })
    const historyString=JSON.stringify(filteredHistory)
    fs.writeFileSync(path.join(__dirname, '../../db/searchHistory.json'), historyString)
    this.history=historyJson
   }
}

export default new HistoryService();
