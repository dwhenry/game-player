module JsonHelper
  def parsed_response
    JSON.parse(response.body, symbolize_names: true)
  end
end

RSpec.configure do |config|
  config.include JsonHelper, type: :request
end
