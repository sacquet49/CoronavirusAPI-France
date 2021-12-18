# installation de node
sudo apt-get install nodejs

# installation de nginx
sudo apt-get install nginx
sudo nano /etc/nginx/conf.d/default.conf
sudo systemctl restart nginx

# installation de certbot + certbot-nginx
sudo apt install python3 python3-venv libaugeas0
sudo python3 -m venv /opt/certbot/
sudo /opt/certbot/bin/pip install --upgrade pip
sudo /opt/certbot/bin/pip install certbot certbot-nginx
sudo certbot --nginx -d www.sacquet-covid.link

# installation de pm2
npm install pm2 -g
cd /rootSourceApp
npm i
pm2 --name covidApp start npm -- start
