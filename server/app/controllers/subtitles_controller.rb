class SubtitlesController < ApplicationController
  def index
    unless params[:id].present?
      Rails.logger.error("Video ID was not provided in request.")
      return render json: { error: 'video_id is required' }, status: :bad_request
    end

    begin
      client = TranscriptClient.new
      subtitles = client.fetch_transcript(params[:id])
      render json: { subtitles: subtitles }

    rescue StandardError => e
      Rails.logger.error("Failed to fetch subtitles: #{e.message}")
      render json: { error: 'Failed to fetch subtitles' }, status: :internal_server_error
    end
  end
end
