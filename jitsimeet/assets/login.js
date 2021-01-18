let domain = '{{ domain }}';
let address = '{{ address }}';
if (domain.length == '0') {
  openWindow("https://{{ address }}:443/");
} else {
  openWindow("https://{{ domain }}:443/");
};
