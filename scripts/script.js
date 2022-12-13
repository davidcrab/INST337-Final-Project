// function retreiveData() {

//   console.log("calling retrieve datsa")

//   var myHeaders = new Headers();
//   myHeaders.append("Cookie", "JSESSIONID=B8FEE760D75E713283A57F34BAD00D1F; __VCAP_ID__=1f074350-f923-4bdc-5e5f-e720");

//   var requestOptions = {
//     method: 'GET',
//     headers: myHeaders,
//     redirect: 'follow'
//   };

//   fetch("https://api.nasa.gov/neo/rest/v1/feed?start_date=2022-01-01&end_date=2022-01-02&api_key=GsgB54uzLqPIoWVRGBHaLqfmI40JfqaL9Yw3SCXD", requestOptions)
//     .then(response => response.text())
//     .then(result => {

//       console.log(result)

//       // do some stuff with the data here... 
//     })
//     .catch(error => console.log('error', error));

// }

async function loadLastSevenDays(date) {
  console.log("Loading last seven days") 
  document.getElementById("countLoader").style.display = "block"

  let todaysDate = new Date();

  if (date) {
    todaysDate = new Date(date)
  }
  const tempDate = new Date(todaysDate)

  // let todaysDate = new Date().toLocaleDateString('en-CA')
  console.log("Todays date", todaysDate)

  let dates = []

  for (let index = 1; index < 8; index++) {

    tempDate.setDate(tempDate.getDate() - 1)
    console.log(tempDate)
    dates.push(tempDate.toLocaleDateString('en-CA'))

  }

  let startDate = dates[dates.length-1]
  let endDate = dates[0]
  
  var myHeaders = new Headers();
  myHeaders.append("Cookie", "JSESSIONID=B8FEE760D75E713283A57F34BAD00D1F; __VCAP_ID__=1f074350-f923-4bdc-5e5f-e720");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=GsgB54uzLqPIoWVRGBHaLqfmI40JfqaL9Yw3SCXD`, requestOptions)
    .then(response => response.json())
    .then(result => {

      let near_earth_objects = result.near_earth_objects

      const asteriodCounts = []

      for (var date of dates) {
        console.log(date, " there was ", near_earth_objects[date].length, " asteriods")
        asteriodCounts.push(near_earth_objects[date].length)
      }

      console.log("Element Count", result.element_count)
      let today = result.near_earth_objects["2022-12-06"]
      console.log(today)

        /* 
          start loading 
          stop loading
        */
      document.getElementById("countLoader").style.display = "none"

      createLastSevenChart(dates, asteriodCounts)

    })
    .catch(error => console.log('error', error));
}

function createLastSevenChart(dates, counts) {
  const ctx = document.getElementById('asteriodCount2');
  
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

  loadLastSevenDays()

  // the async keyword means we can make API requests
  const form = document.querySelector('.main_form'); // get your main form so you can do JS with it
  const submit = document.querySelector('button[type="submit"]'); // get a reference to your submit button
  // submit.style.display = 'none'; // let your submit button disappear

    // And here's an eventListener! It's listening for a "submit" button specifically being clicked
  // this is a synchronous event event, because we already did our async request above, and waited for it to resolve
  form.addEventListener('submit', (submitEvent) => {
    // This is needed to stop our page from changing to a new URL even though it heard a GET request
    submitEvent.preventDefault();

    console.log("Form submitteed")

    // this is the preferred way to handle form data in JS in 2022
    const formData = new FormData(submitEvent.target); // get the data from the listener target
    const formProps = Object.fromEntries(formData); // Turn it into an object

    console.log("Form Data", formData)
    console.log("Form Data", formProps)
    console.log(formProps.date)

    loadLastSevenDays(formProps.date)

  });

}

document.addEventListener('DOMContentLoaded', async () => mainEvent()); 