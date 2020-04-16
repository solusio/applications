let username = 'admin';
let password = '{{ passwd }}';


try{
fetch("https://{{ domain }}:8443/api/v2/cli/admin/call", {
  body: "{ \"params\": [ \"--get-login-link\" ] }",
   headers: {
    Authorization: "Basic "+ btoa(username+":"+password),
    "Content-Type": "application/json"
  },
  method: "POST"
})
  .then((response) => {
	console.log(response.clone().json());
    return response.json();
  })
  .then((data) => {
	var obj = data.stdout;
	var link = obj.split(/\r?\n/);
	openWindow(link[0]);
	end();
  });}
catch(err)
{
	console.log(err)
	end();
}