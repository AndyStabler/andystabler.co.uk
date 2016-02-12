
# Just using raspberry pi as remote server right now
server '192.168.0.10', user: 'deploy'
set :deploy_to, "/var/www/#{fetch(:application)}/staging/"
