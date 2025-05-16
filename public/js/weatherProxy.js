const withLogging = (level = "INFO") =>
  function (target, name, descriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args) {
      const timestamp = new Date().toISOString();
      const methodName = `${target.constructor.name}.${name}`;

      try {
        if (level === "DEBUG" || level === "INFO") {
          console.log(`[${timestamp}] ${level}: Виклик ${methodName}`, args);
        }

        const start = Date.now();
        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - start;

        if (level === "DEBUG") {
          console.log(
            `[${timestamp}] DEBUG: ${methodName} виконано за ${duration}мс`,
            result
          );
        }

        return result;
      } catch (error) {
        console.error(`[${timestamp}] ERROR: Помилка в ${methodName}:`, error);
        throw error;
      }
    };

    return descriptor;
  };

class WeatherAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async fetchWeather(city) {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric&lang=ua`
    );
    if (!response.ok) throw new Error(`Помилка HTTP: ${response.status}`);
    return response.json();
  }
}

class WeatherProxy {
  constructor(api) {
    this.api = api;
    this.cache = null;
    this.cacheExpiry = 5 * 60 * 1000;
  }

  async getWeather(city) {
    const now = Date.now();

    if (this.cache && now - this.cache.timestamp < this.cacheExpiry) {
      return this.cache.data;
    }

    const data = await this.api.fetchWeather(city);
    this.cache = { data, timestamp: now };
    return data;
  }

  getFallbackWeather() {
    return {
      name: "Київ",
      main: { temp: 20 },
      weather: [{ description: "Сонячно (дані не оновлені)" }],
    };
  }
}

const applyDecorator = (target, methodName, decorator) => {
  const descriptor = Object.getOwnPropertyDescriptor(
    target.prototype,
    methodName
  );
  Object.defineProperty(
    target.prototype,
    methodName,
    decorator(target.prototype, methodName, descriptor)
  );
};

const weatherApi = new WeatherAPI("354076ec7ea7a32a8af5febd6930dd2e");

applyDecorator(WeatherAPI, "fetchWeather", withLogging("DEBUG"));
applyDecorator(WeatherProxy, "getWeather", withLogging("INFO"));
applyDecorator(WeatherProxy, "getFallbackWeather", withLogging("ERROR"));

export const weatherProxy = new WeatherProxy(weatherApi);
