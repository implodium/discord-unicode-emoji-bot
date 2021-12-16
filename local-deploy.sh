docker-compose build
docker-compose push

botName=${PWD##*/}

ssh oravm "
mkdir ~/discordBots/$botName
mkdir ~/discordBots/$botName/config
"

scp docker-compose.deploy.yml oravm:discordBots/$botName
scp docker-compose.yml oravm:discordBots/$botName
scp -r .env.prod oravm:discordBots/$botName/


ssh oravm "
mkdir ~/discordBots/$botName
cd ~/discordBots/$botName
docker-compose -f docker-compose.deploy.yml pull
docker-compose -f docker-compose.deploy.yml up -d
"
