// pm2 start cron.js --cron "0 0 * * *"
var xmlHttp = new XMLHttpRequest();
xmlHttp.open( "GET", "https://www.sacquet-covid.link/data/update", false );
xmlHttp.send( null );
