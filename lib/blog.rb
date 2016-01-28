require 'middleman-core'

class Blog < ::Middleman::Extension

  def initialize(app, options_hash={}, &block)
    super
  end

  helpers do

    def previous_post
      articles.select { |article| article.data.published_on < current_page.data.published_on }.last
    end

    def next_post
      articles.select { |article| article.data.published_on > current_page.data.published_on }.first
    end

    def articles(&block)
      @articles ||= sitemap.resources.select { |res| res.path =~ /^blog\/.+\/index.html/ }
      .sort_by { |article| article.data.published_on }
      .each &block
    end
  end

end

::Middleman::Extensions.register(:blog, Blog)
