# With no layout
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

set :js_dir, 'assets/javascripts'
set :images_dir, 'assets/images'
set :css_dir, 'assets/stylesheets'
set :domain, "http://www.andystabler.co.uk"

activate :directory_indexes
# General configuration

activate :blog do |blog|
  # ignore "blog/index.html"
  blog.prefix = "blog"
  blog.layout = "blog/article"
  blog.sources = "articles/{title}.html"
  blog.permalink = "{title}"
  blog.paginate = true
  blog.page_link = "page/{num}"
  blog.per_page = 5
end

# Reload the browser automatically whenever files change
configure :development do
  activate :livereload
end

# Build-specific configuration
configure :build do
  # Minify CSS on build
  activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript
end


