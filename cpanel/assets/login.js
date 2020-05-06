let username = 'root';
let password = '{{ passwd }}';

function json(response) {
  return response.json()
}

// Still some issues with CORS headers. Might be better to use a proxy like: 
// https://cors-anywhere.herokuapp.com/https://{{ address }}:2087/json-api/create_user_session?api.version=1&user=root&service=whostmgrd
fetch("https://{{ address }}:2087/json-api/create_user_session?api.version=1&user=root&service=whostmgrd" , {
   headers: {
    "Authorization": "Basic "+ btoa(username+":"+password),
    "Origin": "{{ address }}"
  },
  method: "GET"
})
  .then(json)
  .then(function (data) {
    var link = data.data.url;
    openWindow(link);
  })
  .catch(function (error) {
    console.log("Magic link couldn't be created: "+error);
    openWindow("https://{{ address }}:2087/");
  });