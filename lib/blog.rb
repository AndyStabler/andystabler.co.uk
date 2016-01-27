require 'middleman-core'

class Blog < ::Middleman::Extension

  def initialize(app, options_hash={}, &block)
    super
  end

  helpers do
    def link_to_previous_post
      article = articles.select { |article| article.data.published_on < current_page.data.published_on }.last
      link_to(article.data.title, article.url) if !article.nil?
    end

    def link_to_next_post
      article = articles.select { |article| article.data.published_on > current_page.data.published_on }.first
      link_to(article.data.title, article.url) if !article.nil?
    end

    def articles(&block)
      @articles ||= sitemap.resources.select { |res| res.path =~ /^blog\/.+\/index.html/ }
      .sort_by { |article| article.data.published_on }
      .each &block
    end
  end

end

::Middleman::Extensions.register(:blog, Blog)
