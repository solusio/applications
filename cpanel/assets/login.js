let username = 'root';
let password = '{{ passwd }}';


fetch("https://{{ hostname }}:2087/json-api/create_user_session?api.version=1&user=root&service=whostmgrd", {
   headers: {
    Authorization: "Basic "+ btoa(username+":"+password)
  },
  method: "GET"
})
  .then(function(response){
	if(!response.ok){
    throw Error(response.statusText);
    }
  })
  .then((data) => {
	console.log(data)
	var obj = data.stdout;
	var link = obj.split(/\r?\n/);
	openWindow(link[0]);
	end();
  }).catch(function(error){

       console.log("Magic link couldn't be created: "+error);

		openWindow("https://{{hostname}}:2087/");
	});