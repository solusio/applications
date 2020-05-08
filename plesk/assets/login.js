fetch('https://{{ domain }}:8443/api/v2/cli/admin/call', {
  body: '{ "params": [ "--get-login-link" ] }',
  headers: {
    Authorization: 'Basic '+ btoa('admin:{{ passwd }}'),
    "Content-Type": "application/json"
  },
  method: "POST"
})
  .then(function(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
  })
  .then(function(data) {
    var link = data.stdout.split(/\r?\n/);
    openWindow(link[0]);
  })
  .catch(function() {
    try {
      openWindow('https://{{ domain }}:8443/login_up.php3?login_name=admin&passwd={{ passwd }}');
    } catch (err) {
      openWindow('https://{{domain}}:8443/');
    }
  });