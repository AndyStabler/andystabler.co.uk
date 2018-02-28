module PageHelpers

  # "A blog post - Blog - Andy Stabler"
  def title_content
    [current_page.data.title, section, "Andy Stabler"].flatten.compact.join(" - ")
  end

  def title_tag(opts = {})
    content_tag :title, (opts[:title] || title_content)
  end

  # Public: Determine the section the current page belongs to. Right now
  # I just care about upper level sections (Blog).
  #
  #
  # Examples
  #
  #   # current url = www.andystabler.co.uk/blog/number-theory-part-1
  #   section()
  #   # => 'Blog'
  #
  #   # current url = www.andystabler.co.uk
  #   section()
  #   # => nil
  #
  # Returns the section the current page belongs to.
  def section
    pages = current_page.url.split("/").reject(&:empty?)
    pages.first.capitalize if pages.any?
  end

  def social_meta_tags(options = {})
    title = options[:title] || title_content
    description = options[:description] || current_page.data.description
    image = options[:image] || current_page.data.image
    path = config.domain + current_page.url

    standard_tags(title, description, image) +
    og_tags(title, description, path, image) +
    twitter_tags(title, description, image)
  end

  def code_tag(language, &block)
    tag = content_tag :pre do
      content_tag :code, h(capture(&block)), class: language
    end
    concat tag
  end

  private

  def standard_tags(title, description, image)
    content_tag(:meta, nil, content: title, property: 'title') +
    (description ? content_tag(:meta, nil, content: description, property: 'description') : '') +
    (image ? content_tag(:link, nil, href: image, property: 'image_src') : '') +
    content_tag(:meta, nil, content: title, itemprop: 'name') +
    (description ? content_tag(:meta, nil, content: description, itemprop: 'description') : '') +
    (image ? content_tag(:meta, nil, content: image, itemprop: 'image') : default_social_image(attributes: {itemprop: 'image'} ))
  end

  def og_tags(title, description, path, image)
    content_tag(:meta, nil, content: title, property: 'og:title') +
    (description ? content_tag(:meta, nil, content: description, property: 'og:description') : '') +
    content_tag(:meta, nil, content: path, property: 'og:url') +
    (image ? content_tag(:meta, nil, content: image, property: 'og:image') : default_social_image(attributes: {property: 'og:image'} ))
  end

  def twitter_tags(title, description, image)
    content_tag(:meta, nil, content: '@andy_staber', name: 'twitter:site') +
    content_tag(:meta, nil, content: 'summary', name: 'twitter:card') +
    content_tag(:meta, nil, content: title, name: 'twitter:title') +
    (description ? content_tag(:meta, nil, content: description, name: 'twitter:description') : '') +
    (image ? content_tag(:meta, nil, content: image, name: 'twitter:image') : default_social_image(attributes: {name: 'twitter:image'} ))
  end

  def default_social_image(attributes:)
    path = image_path("me-illustration.png")
    image_url = URI.join(config[:domain], path)

    opts = { content: image_url }.merge attributes
    content_tag(:meta, nil, opts)
  end
end
