require 'faraday'
require 'json'

# Fetches YouTube caption/transcript data for a given video id.
#
# This wraps a third-party transcript provider (currently Supadata:
# https://supadata.ai) so the rest of the app never has to know which
# vendor is behind it. If we ever need to swap providers, this is the
# only file that should need to change.
class TranscriptClient
  class Error < StandardError; end

  BASE_URL = 'https://api.supadata.ai/v1/transcript'

  def initialize
    @api_key = ENV['SUPADATA_API_KEY']
    raise Error, 'SUPADATA_API_KEY is not set' if @api_key.blank?

    @connection = Faraday.new(url: BASE_URL) do |f|
      f.headers['x-api-key'] = @api_key
      f.adapter Faraday.default_adapter
    end
  end

  # Returns an array of subtitle segments, normalized to:
  #   { start: Float (seconds), duration: Float (seconds), subtitle: String }
  def fetch_transcript(video_id)
    response = @connection.get('', url: youtube_url(video_id))

    unless response.success?
      raise Error, "Supadata returned #{response.status}: #{response.body}"
    end

    body = JSON.parse(response.body)
    segments = body['content']

    unless segments.is_a?(Array)
      raise Error, "Unexpected response shape from Supadata: #{response.body}"
    end

    segments.map do |segment|
      {
        start: segment['offset'].to_f / 1000.0,
        duration: segment['duration'].to_f / 1000.0,
        subtitle: segment['text']
      }
    end
  end

  private

  def youtube_url(video_id)
    "https://www.youtube.com/watch?v=#{video_id}"
  end
end
