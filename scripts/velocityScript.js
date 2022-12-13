function getData(date) {
  let todaysDate = new Date();

  if (date) {
    todaysDate = new Date(date)
  }

  const tempDate = new Date(todaysDate)
  let dates = []

  for (let index = 1; index < 8; index++) {
    tempDate.setDate(tempDate.getDate() - 1)
    console.log(tempDate)
    dates.push(tempDate.toLocaleDateString('en-CA'))
  }

  let startDate = dates[dates.length-1]
  let endDate = dates[0]
  
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=GsgB54uzLqPIoWVRGBHaLqfmI40JfqaL9Yw3SCXD`, requestOptions)
    .then(response => response.json())
    .then(result => {

      let near_earth_objects = result.near_earth_objects

      let data = []

      // iterate dates, iterate asteriods
      for (var date of dates) {
        console.log(near_earth_objects[date])
        for (var asteriod of near_earth_objects[date]) {

          let diameter = parseInt(asteriod.estimated_diameter.feet.estimated_diameter_max) / 100

          let asteriodData = {
            x: parseInt(asteriod.close_approach_data[0].miss_distance.miles), 
            y: parseInt(asteriod.close_approach_data[0].relative_velocity.miles_per_hour),
            r: diameter
          }

          // r: parseInt(asteriod.estimated_diameter.feet.estimated_diameter_max),
          data.push(asteriodData)
        }
      }
      console.log(data)

      document.getElementById("countLoader").style.display = "none"
      createBubbleChart(data)

    })
    .catch(error => console.log('error', error));
}

function createBubbleChart(data) {

  let formattedData = {
    datasets: [{
      label: 'Asteriod Speed, Distance, Diameter',
      data: data,
      backgroundColor: '#343d46'
    }]
  };

  const ctx = document.getElementById('velocityChart');

  new Chart(ctx, {
    type: 'bubble',
    data: formattedData,
  });
}


function createLastSevenChart(dates, counts) {
  const ctx = document.getElementById('velocityChart');
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dates,
      datasets: [{
        label: '# of Asteriods',
        data: counts,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

}

async function mainEvent() {
  getData()
}

document.addEventListener('DOMContentLoaded', async () => mainEvent()); 