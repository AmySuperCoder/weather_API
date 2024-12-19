import { Router } from "express";
import { randomUUID } from "node:crypto";
const router = Router();

import HistoryService, { City } from "../../service/historyService.js";

import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post("/", async (req, res) => {
  // TODO: GET weather data from city name
  // TODO: save city to search history
  const weatherResponse = await WeatherService.getWeatherForCity(req.body.city)
  const newCity = new City(req.body.city, randomUUID());
  await HistoryService.write([newCity]);
  res.json({
    success: true, 
    data: weatherResponse,
  })
});

// TODO: GET search history
router.get("/history", async (req, res) => {
  const searchHistory = await HistoryService.read();
  res.json({
    success: true,
    data: searchHistory,
  });
});

// * BONUS TODO: DELETE city from search history
router.delete("/history/:id", async (req, res) => {
  await HistoryService.removeCity(req.params.id)
  res.json({
    success: true
  }) 
});

export default router;
