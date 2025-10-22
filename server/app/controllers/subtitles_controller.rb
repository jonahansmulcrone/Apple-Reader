class SubtitlesController < ApplicationController
  def index
    client ||= LambdaClient.new
    subtitles = client.fetch_subtitles(params[:id])

    render json: { subtitles: subtitles }
  end
end
