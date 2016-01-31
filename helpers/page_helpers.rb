module PageHelpers

  def title_tag(opts = {})
    # connect the title, subsections, and "Andy Stabler" to get a title like "A blog post - Blog - Andy Stabler"
    title = [current_page.data.title, opts[:subsections], "Andy Stabler"].flatten.compact.join(" - ")
    content_tag :title, title
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
    pages = current_page.path.split("/")
    pages.first.capitalize if pages.count > 1
  end
end
