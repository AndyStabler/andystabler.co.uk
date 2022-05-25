xml.instruct!
xml.feed "xmlns" => "http://www.w3.org/2005/Atom" do
  xml.title "Andy Stabler"
  xml.subtitle "Blog"
  xml.id "https://andystabler.co.uk/"
  xml.link "href" => "https://andystabler.co.uk"
  xml.link "href" => "https://andystabler.co.uk/feed.xml", "rel" => "self"
  xml.updated blog.articles.first.date.to_time.iso8601
  xml.author { xml.name "Andy Stabler" }

  blog.articles[0..10].each do |article|
    article_url = config.domain + article.url
    xml.entry do
      xml.title article.title
      xml.link "rel" => "alternate", "href" => article_url
      xml.id article_url
      xml.published article.date.to_time.iso8601
      xml.updated article.date.to_time.iso8601
      xml.author { xml.name "Andy Stabler" }
      xml.summary article.summary, "type" => "html"
      xml.content article.body, "type" => "html"
    end
  end
end
