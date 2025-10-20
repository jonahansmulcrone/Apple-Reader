class SubtitlesController < ApplicationController
  def index
    client ||= LambdaClient.new
    client.fetch_subtitles(params[:id])
  end
end
