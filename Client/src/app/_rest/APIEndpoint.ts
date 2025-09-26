enum RestApiEndpoint {
  WEATHER_FORECAST = 'http://localhost:5159/weatherforecast',
  GET_PROFILE = 'http://localhost:5159/user',
  GET_USER_COUNTERS = 'http://localhost:5159/counter/counters',
  CREATE_COUNTER = 'http://localhost:5159/counter/create',
  UPDATE_COUNTER_AMOUNT = 'http://localhost:5159/counter/{id}',
}
export { RestApiEndpoint };
