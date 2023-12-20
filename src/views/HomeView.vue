<template>
  <div 
    class="container-div"
    :class="{'blue-background': data?.weather[0]?.main == 'Smoke',
            'gray-background': data?.weather[0]?.main == 'Clouds'}">
    <form @submit.prevent="submit" class="main-form">
      <label>
        <input class="form-input" type="text" v-model.trim="cityName" name="cityName" />
      </label>
      <button class="btn" type="submit">Submit</button>
    </form>
    <div class="sub-container d-flex">
      <div class="img-container">
        <img v-if="data?.weather[0]?.main == 'Smoke'" class="weather-img" src="../assets/sun.png" alt="" />
        <img v-if="data?.weather[0]?.main == 'Clouds'" class="weather-img" src="../assets/cloudy.png" alt="" />
      </div>
      <div class="details-container">
        <div class="temp-count">{{formattedTemperature}} °{{unit=='Celsius' ? 'C' : 'F'}}</div>
        <div class="toggle-unit" @click="toggleUnit">Show in {{unit=='Celsius' ? 'Fahrenheit' : 'Celsius'}}</div>
        <h1 class="weather-status">{{data?.weather[0]?.main}}</h1>
        <h2 class="cityName" >{{data?.name}}</h2>
        <div class="humidity-wind-container d-flex">
          <div class="humidity-container d-flex">
            <img src="../assets/temperature.png" alt="" width="50px" />
            <div>
              <div>{{data?.main?.humidity}}%</div>
              <h4>Humidity</h4>
            </div>
          </div>
          <div class="wind-container d-flex">
            <img src="../assets/wind.png" alt="" width="50px"/>
            <div>
              <div>{{data?.wind?.speed}} Km/h</div>
              <h4>Wind Speed</h4>
            </div>
          </div>
        </div>
      </div>
    </div>


  <div class="date-container">
    <div v-for="(date,index) in dates" class="date-display">
      <h3 class="date margin-bottom">{{dateToDay(date)}}</h3>
      <div class="margin-bottom">{{forecastDataByDate[date][0].main.temp}} °C</div>
      <div class="margin-bottom">{{forecastDataByDate[date][0].weather[0].main}}</div>
    </div>
  </div>

  </div>
</template>

<script>
import { getCurrentReport, getCurrentReportByCityName, getWeatherForecastByCityName } from '../service/dataService';
import moment from 'moment';

export default {
  props: {},
  data () {
    return {
      cityName:'',
      data:'',
      forcastData: null,
      temperature: null,
      unit: 'Celsius',
      dates:[],
      forecastDataByDate:[]
    }
  },
  methods: { 
    toggleUnit() {
      if (this.unit === 'Celsius') {
        // Convert Celsius to Fahrenheit
        this.temperature = (this.temperature * 9/5) + 32;
        this.unit = 'Fahrenheit';
      } else {
        // Convert Fahrenheit to Celsius
        this.temperature = (this.temperature - 32) * 5/9;
        this.unit = 'Celsius';
      }
    },

    dateToDay(date){
      return moment(date).format('ddd');
    },

    calculateData() {
      const result = {};
      if(this.forcastData?.list){
        this.forcastData.list.forEach(element => {
          const date = element.dt_txt.split(' ')[0];
          if (!result[date]) {
            // If not, create a new array for that date
            result[date] = [];
          }
          result[date].push(element);
        });
        this.dates = Object.keys(result);
        this.forecastDataByDate = result;
        console.log(result)
      }
    },

    getWeatherForecastReport() {
     getWeatherForecastByCityName(this.cityName).then((data)=>{
          this.forcastData = data;
          this.calculateData();
        }).catch(function (error) {
          console.log(error);
        })
    },

    submit() {
      getCurrentReportByCityName(this.cityName).then((data)=>{
          this.cityName = data?.name;
          this.data = data;
          this.getWeatherForecastReport();
        }).catch(function (error) {
          console.log(error);
        })
    }
  },

  created() {
    const success = (position) => {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;

        getCurrentReport(latitude,longitude).then((data)=>{
          this.cityName = data?.name;
          this.data = data;
          this.temperature = data?.main?.temp;
          this.getWeatherForecastReport();
        }).catch(function (error) {
          console.log(error);
        })
    };
    const error = (err) => {
        console.log(err)
    };

    navigator.geolocation.getCurrentPosition(success, error);
},
  computed: {
    formattedTemperature() {
      return this.temperature.toFixed(2);
    }
  },
}
</script>

<style scoped>
#app {
  padding: 2%;
}
.d-flex {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.container-div {
  padding: 2% 2% 0% 2%;
  min-height: 100vh;
}

.details-container {
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.temp-count {
  font-size: 100px;
}

.blue-background {
  background: linear-gradient(to bottom right, skyblue, blue);
}

.gray-background {
    background: linear-gradient(to bottom right, lightgray, gray);
}

.btn {
  padding: 10px;
  border-radius: 5px;
  color: #1573af;
  font-size: 16px;
  font-weight: 500;
  min-width: 140px;
  height: auto;
  color: #fff;
  background-color: #285a7b;
  border: 1px solid #285a7b;
}

.btn:hover {
  background-color: #fff;
  color: #285a7b;
}

.form-input {
  border-radius: 5px;
  box-shadow: 3px 3px 6px 0 rgba(10, 95, 144, 0.14);
  border: solid 1px #dbdbdb;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
}

.main-form {
  display: flex;
  justify-content: center;
  gap: 1%;
  align-items: center;
}

.toggle-unit {
  cursor: pointer;
  width: fit-content;
  text-align: center;
}

.cityName {
  margin-bottom: 5%;
}

.temp-count,.toggle-unit,.weather-status {
  margin-bottom: 2%;
}

.date-container {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  padding: 2% 2% 0% 2%;
}

.date-display {
  border: 1px solid white;
  padding: 2%;
  border-radius: 10px;
  margin: 2%;
}

.margin-bottom {
  margin-bottom: 2%;
}

.img-container img {
    max-width: 70%;
}

@media only screen and (max-width: 767px) {
  .sub-container {
    flex-direction: column;
  }

  .img-container img {
    max-width: 200px;
  }

  .main-form {
    padding: 5%;
  }

  .img-container {
    margin: 5% auto 5% auto;
  }

  .date-container {
    justify-content: flex-start;
    overflow: scroll;
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) {
  .sub-container {
    flex-direction: column;
  }
  .img-container img{
    max-width: 100%;
  }
}

</style>