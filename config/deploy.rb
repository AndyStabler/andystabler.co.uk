require 'byebug'
# config valid only for current version of Capistrano
lock '3.4.0'

set :application, 'andystabler.co.uk'
set :repo_url, 'git@github.com:AndyStabler/andystabler.co.uk.git'
set :rvm1_ruby_version, "ruby-2.3.0"
set :deploy_via, :remote_cache
set :branch, `git rev-parse --abbrev-ref HEAD`.chomp

before 'deploy:updated', 'deploy:build'
before 'deploy', 'rvm1:install:rvm'  # install/update RVM

namespace :deploy do

  desc 'Show the deployed SHA'
  task :sha do
    on roles(:all) do
      execute :cat, "#{current_path}/REVISION"
    end
  end

  desc "Build the website"
  task :build do
    on roles(:all) do
      within release_path do
        # install the gems
        execute :bundle
        # build the site
        execute :middleman, :build
      end
    end
  end
end