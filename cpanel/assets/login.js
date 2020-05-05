let username = 'root';
let password = '{{ passwd }}';



function json(response) {
  return response.json()
}

// Still some issues with CORS headers. Might be better to use a proxy like: 
// https://cors-anywhere.herokuapp.com/https://{{hostname}}:2087/json-api/create_user_session?api.version=1&user=root&service=whostmgrd
fetch("https://{{hostname}}:2087/json-api/create_user_session?api.version=1&user=root&service=whostmgrd" , {
   headers: {
    "Authorization": "Basic "+ btoa(username+":"+password),
	"Origin": "{{ address }}"
  },
  method: "GET"
})
  .then(json)
  .then(function(data){
	var link = data.data.url;
	console.log("link: ",link);
	openWindow(link);
	end();
	})
  
  .catch(function(error){

       console.log("Magic link couldn't be created: "+error);

		openWindow("https://{{hostname}}:2087/");
	});