require 'aws-sigv4'
require 'faraday'
require 'json'

class LambdaClient
    def initialize
        set_credentials
        aws_signer
        
        @faraday = Faraday.new do |f|
            f.adapter Faraday.default_adapter
        end
    end

    def fetch_subtitles(id)
        base_url= ENV["LAMBDA_FUNCTION_URL"]
        url = "#{base_url}?video_id=#{URI.encode_www_form_component(id)}"

        signed_request = @signer.sign_request(
            http_method: 'GET',
            url: url,
            headers: {}  
        )

        response = @faraday.get(url) do |req|
            req.headers = signed_request.headers
        end

        if response.success?
            JSON.parse(response.body)
        else
            Rails.logger.error("Lambda error: #{response.body}")
            raise "Lambda returned #{response.status}: #{response.body}"
        end
    end

    private
    def set_credentials
        @credentials = {
            AWS_ACCESS_KEY: ENV["AWS_ACCESS_KEY"],
            AWS_SECRET_KEY: ENV["AWS_SECRET_KEY"]
        }
    end

    def aws_signer
        @signer = Aws::Sigv4::Signer.new(
            service: 'lambda',
            region: ENV['AWS_REGION'],
            access_key_id: @credentials[:AWS_ACCESS_KEY],
            secret_access_key: @credentials[:AWS_SECRET_KEY]
        )
    end
end