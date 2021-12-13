function configurePleskTrial($user, $passwd, $email) {
    plesk bin init_conf --init -name $user -passwd $passwd -email $email -license_agreed true -trial_license true
}

function congnigurePleskLicense($user, $passwd, $email, $licenseKey) {
    plesk bin init_conf --init -name $user -passwd $passwd -email $email -license_agreed true
    plesk bin license --install $licenseKey
}

function createPleskSubscription($domain, $user, $passwd, $ip) {
    plesk bin subscription --create $domain -owner admin -service-plan "UNLIMITED" -login $user -passwd $passwd -ip $ip
}

function additionalConfiguration {
    plesk bin settings --set solution_type="SOLUSIO"
    plesk bin poweruser --on
    plesk bin settings --set secure_passwords=true
}

# This is to stop the script on the error message
$ErrorActionPreference = "Stop"

# This is to find the current directory and find config.ini in that directory
$executingScriptDirectory = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
$configPath = "$executingScriptDirectory\config.ini"

# Let's fetch the variables from the config.ini file. Expected variables:
# domain - domain to create subscription for
# rootmail - root mail to be used by plesk
# user - user used for the subscription
# passwd - password for the above user
# ip - IP used for the subscription
# activation_key - Activation key for Plesk
$values = Get-Content $configPath | Out-String | ConvertFrom-StringData

# Let's wait for cloning cloning to be done so that all required services are up and running
while (@(plesk bin cloning --status) -ne 0) {
    Add-Content C:\inetpub\vhosts\default\htdocs\progress.json '{\n"status":"Waiting for VM",\n"progress":"0"\n}'
    sleep(10)
}

# Let's get the ip from the database in case we don't have any
if (!$values.ip) {
    $values.ip=@(plesk db -Ne 'SELECT IP_Address FROM IP_Addresses LIMIT 1');
}

Add-Content C:\inetpub\vhosts\default\htdocs\progress.json '{\n"status":"Configuring Plesk",\n"progress":"20"\n}'

# if we don't have the activation_key then activate a trial license
if (!$values.activation_key) {
    configurePleskTrial $values.user $values.passwd $values.rootmail
    Add-Content C:\inetpub\vhosts\default\htdocs\progress.json '{\n"status":"Plesk init_conf done with trial license",\n"progress":"50"\n}'

    createPleskSubscription $values.domain $values.user $values.passwd $values.ip
    Add-Content C:\inetpub\vhosts\default\htdocs\progress.json '{\n"status":"Subscription created in Plesk",\n"progress":"75"\n}'

    additionalConfiguration
    Add-Content C:\inetpub\vhosts\default\htdocs\progress.json '{\n"status":"Everything is up and running",\n"progress":"100"\n}'

    exit 0
}

configurePleskLicense $values.user $values.passwd $values.rootmail $values.activation_key
Add-Content C:\inetpub\vhosts\default\htdocs\progress.json '{\n"status":"Plesk init_conf done with a valid license",\n"progress":"50"\n}'

createPleskSubscription $values.domain $values.user $values.passwd $values.ip
Add-Content C:\inetpub\vhosts\default\htdocs\progress.json '{\n"status":"Subscription created in Plesk",\n"progress":"75"\n}'

additionalConfiguration
Add-Content C:\inetpub\vhosts\default\htdocs\progress.json '{\n"status":"Everything is up and running",\n"progress":"100"\n}'
