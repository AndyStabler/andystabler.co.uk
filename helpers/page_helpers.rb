module PageHelpers

  def title_tag(opts = {})
    # connect the title, subsections, and "Andy Stabler" to get a title like "A blog post - Blog - Andy Stabler"
    title = [current_page.data.title, opts[:subsections], "Andy Stabler"].flatten.compact.join(" - ")
    content_tag :title, title
  end
end
