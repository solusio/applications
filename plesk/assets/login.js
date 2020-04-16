let username = 'admin';
let password = '{{ passwd }}';


fetch("https://{{ domain }}:8443/api/v2/cli/admin/call", {
  body: "{ \"params\": [ \"--get-login-link\" ] }",
   headers: {
    Authorization: "Basic "+ btoa(username+":"+password),
    "Content-Type": "application/json"
  },
  method: "POST"
})
  .then(function(response){
	if(!response.ok){
    throw Error(response.statusText);
    }
  })
  .then((data) => {
	var obj = data.stdout;
	var link = obj.split(/\r?\n/);
	openWindow(link[0]);
	end();
  }).catch(function(error){

                
           try{
    openWindow("https://{{ domain }}:8443/login_up.php3?login_name=admin&passwd={{ passwd }}");
		   }
	catch(err){
		openWindow("https://{{domain}}:8443/");
	}
  });