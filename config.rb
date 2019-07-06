set :domain, "http://www.andystabler.co.uk"

activate :autoprefixer do |prefix|
  prefix.browsers = "last 2 versions"
end

activate :directory_indexes

activate :blog do |blog|
  blog.prefix = "blog"
  blog.layout = "blog/article"
  blog.sources = "articles/{title}.html"
  blog.permalink = "{title}"
  blog.paginate = true
  blog.page_link = "page/{num}"
  blog.per_page = 5
end

# Layouts
# https://middlemanapp.com/basics/layouts/

# Per-page layout changes
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

# Build-specific configuration
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings

configure :build do
  activate :minify_css
  activate :minify_javascript
  activate :gzip
  activate :asset_hash
end
