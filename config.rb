# With no layout
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

set :js_dir, 'assets/javascripts'
set :images_dir, 'assets/images'
set :css_dir, 'assets/stylesheets'

# General configuration

activate :blog do |blog|
  # ignore "blog/index.html"
  blog.layout = "blog/article"
  blog.sources = "blog/articles/{title}.html"
  blog.permalink = "blog/{title}"
  blog.paginate = true
  blog.page_link = "page/{num}"
  blog.per_page = 2
end

# Reload the browser automatically whenever files change
configure :development do
  activate :livereload
end

# Build-specific configuration
configure :build do
  # Minify CSS on build
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript
end


